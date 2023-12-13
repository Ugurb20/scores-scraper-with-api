package controllers

import (
	"net/http"
	"scores-api/models"
	"time"

	"github.com/gin-gonic/gin"
)

func GetUpdatedMatches(c *gin.Context){
	var matches []models.Match
	threshold := time.Now().Add(-30 * time.Minute)

	models.DB.Table("Match").Where("updated_at >= ?", threshold).Find(&matches)

	c.JSON(http.StatusOK, gin.H{"data": matches})
	return
}