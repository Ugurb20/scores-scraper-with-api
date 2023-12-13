package models

import (
	"errors"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() error {
	
	db, err := gorm.Open(postgres.Open("postgresql://postgres:mysecretpassword@localhost:5432/postgres"), &gorm.Config{})

	if(err != nil){
		return errors.New("Can't connect to DB")
	}

	sqlDB, err := db.DB()

	if(err != nil){
		return errors.New("Can't create DB object")
	}

	fmt.Println("Connected to DB: ", sqlDB.Ping() == nil)

	db.AutoMigrate(&Match{})

	DB = db	

	return nil
}