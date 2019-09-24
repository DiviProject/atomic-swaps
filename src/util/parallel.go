// Package util provides various utility functions to execute atomic swaps
package util

import "sync"

// Parallel : Run multiple lambdas parallel to each other
// This function is used to run both the GRPC and HTTP server together.
func Parallel(functions ...func()) {
	var waitGroup sync.WaitGroup
	waitGroup.Add(len(functions))

	defer waitGroup.Wait()

	for _, function := range functions {
		go func(copy func()) {
			defer waitGroup.Done()
			copy()
		}(function)
	}
}
