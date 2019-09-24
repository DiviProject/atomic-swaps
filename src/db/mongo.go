// Package db provides the functions to interact with the atomic swaps MongoDB instance
package db

import (
	"atomic-swaps/src/util"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"gopkg.in/mgo.v2/bson"
)

// AtomicSwap : The schema to keep track of atomic swaps and their status
type AtomicSwap struct {
	_id                   string
	Status                string
	Secret                string
	BaseStatus            string
	SwapStatus            string
	BaseAddress           string
	SwapAddress           string
	BaseContract          string
	SwapContract          string
	BaseTransaction       string
	SwapTransaction       string
	BaseTransactionBytes  string
	SwapTransactionBytes  string
	BaseRedeemTransaction string
	SwapRedeemTransaction string
	BaseRefund            string
	SwapRefund            string
	BaseAmount            string
	SwapAmount            string
	BaseFee               string
	SwapFee               string
	BaseRefundFee         string
	SwapRefundFee         string
}

// Init : Create the MongoDB instance
// You can specify the uri default is mongodb://localhost:27017
func Init(uri string) error {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	db, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	util.MongoDB = db

	return err
}

// Ping : Confirm MongoDB instance is connected
func Ping(client *mongo.Client) error {
	ctx, _ := context.WithTimeout(context.Background(), 2*time.Second)
	return client.Ping(ctx, readpref.Primary())
}

// Insert : Insert a document into MongoDB
func Insert(data AtomicSwap) (interface{}, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection := util.MongoDB.Database(util.Configuration.Database).Collection(util.MongoTable)

	res, err := collection.InsertOne(ctx, bson.M{
		"Status":                data.Status,
		"BaseStatus":            data.BaseStatus,
		"SwapStatus":            data.SwapStatus,
		"BaseAddress":           data.BaseAddress,
		"SwapAddress":           data.SwapAddress,
		"BaseContract":          data.BaseContract,
		"SwapContract":          data.SwapContract,
		"BaseTransaction":       data.BaseTransaction,
		"SwapTransaction":       data.SwapTransaction,
		"BaseTransactionBytes":  data.BaseTransactionBytes,
		"SwapTransactionBytes":  data.SwapTransactionBytes,
		"BaseRedeemTransaction": data.BaseRedeemTransaction,
		"SwapRedeemTransaction": data.SwapRedeemTransaction,
		"BaseRefund":            data.BaseRefund,
		"SwapRefund":            data.SwapRefund,
		"BaseAmount":            data.BaseAmount,
		"SwapAmount":            data.SwapAmount,
		"BaseFee":               data.BaseFee,
		"SwapFee":               data.SwapFee,
		"BaseRefundFee":         data.BaseFee,
		"SwapRefundFee":         data.SwapFee,
	})

	return res.InsertedID, err
}

// Update : Update a document in MongoDB
func Update(data AtomicSwap) error {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection := util.MongoDB.Database(util.Configuration.Database).Collection(util.MongoTable)

	_, err := collection.UpdateOne(ctx,
		bson.M{
			"_id": data._id,
		},
		bson.M{
			"Status":                data.Status,
			"BaseStatus":            data.BaseStatus,
			"SwapStatus":            data.SwapStatus,
			"BaseAddress":           data.BaseAddress,
			"SwapAddress":           data.SwapAddress,
			"BaseContract":          data.BaseContract,
			"SwapContract":          data.SwapContract,
			"BaseTransaction":       data.BaseTransaction,
			"SwapTransaction":       data.SwapTransaction,
			"BaseTransactionBytes":  data.BaseTransactionBytes,
			"SwapTransactionBytes":  data.SwapTransactionBytes,
			"BaseRedeemTransaction": data.BaseRedeemTransaction,
			"SwapRedeemTransaction": data.SwapRedeemTransaction,
			"BaseRefund":            data.BaseRefund,
			"SwapRefund":            data.SwapRefund,
			"BaseAmount":            data.BaseAmount,
			"SwapAmount":            data.SwapAmount,
			"BaseFee":               data.BaseFee,
			"SwapFee":               data.SwapFee,
			"BaseRefundFee":         data.BaseFee,
			"SwapRefundFee":         data.SwapFee,
		},
	)

	return err
}

// Find : Find a document in MongoDB
func Find(id string) (AtomicSwap, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection := util.MongoDB.Database(util.Configuration.Database).Collection(util.MongoTable)

	var res AtomicSwap
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&res)

	return res, err
}

// FindPending : Find all pending documents in MongoDB
func FindPending() ([]AtomicSwap, error) {
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection := util.MongoDB.Database(util.Configuration.Database).Collection(util.MongoTable)

	var res []AtomicSwap

	cur, err := collection.Find(ctx, bson.M{"Status": "pending"})

	if err != nil {
		return res, err
	}

	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var doc bson.M
		err := cur.Decode(&doc)

		var result AtomicSwap
		result._id = doc["_id"].(string)
		result.Status = doc["Status"].(string)
		result.BaseStatus = doc["BaseStatus"].(string)
		result.SwapStatus = doc["SwapStatus"].(string)
		result.BaseAddress = doc["BaseAddress"].(string)
		result.SwapAddress = doc["SwapAddress"].(string)
		result.BaseContract = doc["BaseContract"].(string)
		result.SwapContract = doc["SwapContract"].(string)
		result.BaseTransaction = doc["BaseTransaction"].(string)
		result.SwapTransaction = doc["SwapTransaction"].(string)
		result.BaseRedeemTransaction = doc["BaseRedeemTransaction"].(string)
		result.SwapRedeemTransaction = doc["SwapRedeemTransaction"].(string)
		result.BaseRefund = doc["BaseRefund"].(string)
		result.SwapRefund = doc["SwapRefund"].(string)
		result.BaseAmount = doc["BaseAmount"].(string)
		result.SwapAmount = doc["SwapAmount"].(string)
		result.BaseFee = doc["BaseFee"].(string)
		result.SwapFee = doc["SwapFee"].(string)
		result.BaseRefundFee = doc["BaseRefundFee"].(string)
		result.SwapRefundFee = doc["SwapRefundFee"].(string)

		res = append(res, result)

		if err != nil {
			return res, err
		}
	}

	return res, nil
}
