package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) {
	if err != nil {
		fmt.Printf("%s: %s\n", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}

func getConnAmqp() (*amqp.Connection, error) {
	conn, err := amqp.Dial(os.Getenv("BROKER_URL"))
	if err != nil {
		return nil, err
	}

	return conn, nil
}

func main() {
	conn, err := getConnAmqp()
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	msgs, err := ch.Consume(
		"weather_data",
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			res, err := http.Post(
				os.Getenv("API_URL"),
				"application/json",
				bytes.NewReader(d.Body),
			)
			if err != nil {
				fmt.Printf("Failed to send HTTP request: %s\n", err)
				d.Nack(false, true)
				time.Sleep(1 * time.Second)
				continue
			}

			res.Body.Close()
			d.Ack(false)
			time.Sleep(1 * time.Second)
		}
	}()

	fmt.Println("Waiting for messages. To exit press CTRL+C")
	<-forever
}
