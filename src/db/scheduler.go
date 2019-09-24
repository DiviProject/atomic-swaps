// Package db provides the functions to interact with the atomic swaps MongoDB instance
package db

import (
	"time"
)

// Scheduler : run a function every N amount in a time interval
func Scheduler(lamda func(), interval time.Duration, startDelay time.Duration) {
	go func(lamda func(), interval time.Duration, startDelay time.Duration) {
		time.Sleep(startDelay)
		ticker := time.NewTicker(interval)
		for range ticker.C {
			lamda()
		}
	}(
		lamda,
		interval,
		startDelay,
	)
}

// StartSchedule : run a lamda every 10 seconds
func StartSchedule(lamda func()) {
	Scheduler(
		lamda,
		time.Second*10,
		time.Second*0,
	)
}
