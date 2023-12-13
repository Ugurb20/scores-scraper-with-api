package controllers

import (
	"net/http"
	"regexp"
	"scores-api/models"

	"github.com/gin-gonic/gin"
)

func GetMatches(c *gin.Context) {
	datePattern := `^\d{4}-\d{2}-\d{2}$`
	date := c.Param("date")
	matched, err := regexp.MatchString(datePattern, date)

	if (err != nil || !matched){
		c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong Date Format"})
		return
	}	
	
	var matches []models.Match

	models.DB.Table("Match").Where("match_date = ?", date).Find(&matches)

	c.JSON(http.StatusOK, gin.H{"data":matches})
	return
}