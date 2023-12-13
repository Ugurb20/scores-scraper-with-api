package main

import (
	"scores-api/controllers"
	"scores-api/models"

	"github.com/gin-gonic/gin"
)

func main(){
	router := gin.Default()
	models.ConnectDB()

	router.GET("/", func(c *gin.Context ){
		
		c.String(200, "Hello World")
	})
	
	router.GET("/matches/:date", controllers.GetMatches)
	router.GET("updated-matches", controllers.GetUpdatedMatches)
	router.Run(":8080")
}