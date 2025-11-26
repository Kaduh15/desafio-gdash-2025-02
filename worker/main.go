package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	amqp "github.com/rabbitmq/amqp091-go"
)

func init() {
	godotenv.Load()

	fmt.Println("Environment variables loaded")
}

func main() {
	URL_WEBHOOK := os.Getenv("URL_WEBHOOK")
	BROKER_URL := os.Getenv("BROKER_URL")
	BROKER_QUEUE := os.Getenv("BROKER_QUEUE")

	conn, err := amqp.Dial(BROKER_URL)
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		panic(err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		BROKER_QUEUE,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			fmt.Printf("Received a message: %s\n", d.Body)

			response, err := http.Post(URL_WEBHOOK, string("application/json"), bytes.NewBuffer(d.Body))

			if err != nil {
				fmt.Printf("Failed to send to webhook: %s\n", err)
			} else {
				fmt.Printf("Webhook response status: %s\n", response.Status)
				response.Body.Close()
				d.Ack(false)
			}
		}
	}()

	fmt.Println("Waiting for messages. To exit press CTRL+C")
	<-forever

}
