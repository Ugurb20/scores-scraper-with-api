import puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getDate() {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

async function writeDb(data) {
  console.log('Writing data to DB -----');

  const existingMatch = await prisma.match.findUnique({
    where: { id: data.id },
  });

  if (existingMatch) {
    const isDataChanged =
      existingMatch.home_team_score !== Number(data.homeTeamScore) ||
      existingMatch.away_team_score !== Number(data.awayTeamScore);

    if (isDataChanged) {
      await prisma.match.update({
        where: { id: data.id },
        data: {
          home_team_score: Number(data.homeTeamScore),
          away_team_score: Number(data.awayTeamScore),
          updated_at: new Date(),
        },
      });
    }
  } else {
    await prisma.match.create({
      data: {
        id: data.id,
        home_team_name: data.homeTeamName,
        away_team_name: data.awayTeamName,
        home_team_score: Number(data.homeTeamScore),
        away_team_score: Number(data.awayTeamScore),
        status: data.state,
        match_start_utc: String(data.matchStartUtc),
      },
    });
  }

  console.log('Data written to DB -----');
}

(async () => {
  const reqUrl = `https://www.mackolik.com/perform/p0/ajax/components/competition/livescores/json?sports[]=Soccer&sports[]=Basketball&sports[]=Tennis&matchDate=${getDate()}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (
      !request.isNavigationRequest() &&
      request.url() !== page.url() &&
      request.url() !== reqUrl
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
  await page.goto('https://www.mackolik.com/canli-sonuclar');

  const response = await page.evaluate(async (url) => {
    const resp = await fetch(url, {
      /*  referrer:
        'https://www.mackolik.com/js/livescoreDataWorker.7fb2ac855d.worker.js', */
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });
    return await resp.json();
  }, reqUrl);

  try {
    const parsedResponse = JSON.parse(JSON.stringify(response));
    const comps = Object.keys(parsedResponse.data.competitions);
    const selectedComps = [];
    comps.forEach((compId) => {
      if (
        parsedResponse.data.competitions[compId].code === 'TSL' ||
        parsedResponse.data.competitions[compId].code === 'EPL'
      ) {
        selectedComps.push(compId);
      }
    });
    const matches = Object.keys(parsedResponse.data.matches);
    const selectedMatches = [];

    matches.forEach((matchId) => {
      if (
        selectedComps.includes(
          parsedResponse.data.matches[matchId].competitionId,
        )
      ) {
        selectedMatches.push(parsedResponse.data.matches[matchId]);
      }
    });

    selectedMatches.forEach(async (match) => {
      await writeDb({
        id: match.id,
        homeTeamName: match.awayTeam.name,
        awayTeamName: match.homeTeam.name,
        awayTeamScore: match.score.away,
        homeTeamScore: match.score.home,
        state: match.state,
        matchStartUtc: match.mstUtc,
      });
    });
    await prisma.$disconnect();
  } catch (err) {
    await prisma.$disconnect();
    console.log('Wrong response', err);
  }
  await browser.close();
})();
