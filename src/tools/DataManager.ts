import { MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Sample } from "./samples.model";
import { InsertOneResult } from "mongodb";
import sanitizeHtml from "sanitize-html";

// MongoDB database connectivity constants
// const URL:string = "mongodb://mongo:27017";
const URL:string = process.env.MONGO_URL!;
const DB_NAME:string = "dbPortfolio";
const COLLECTION_NAME:string = "samplesCollection";

export async function getSamples() {
  let mongoClient:MongoClient = new MongoClient(URL);
  let samplesArray:Sample[] = [];

  try {
    // make connection to mongoDB server (ASYNC task)
    await mongoClient.connect();
    samplesArray = await mongoClient.db(DB_NAME).collection<Sample>(COLLECTION_NAME).find().sort("name", 1).toArray();   
    // need to convert ObjectId objects to strings - otherwise it cannot be converted to JSON
    samplesArray.forEach((sample:Sample) => sample._id = sample._id.toString());
  } catch (error:any) {
    throw error;
  } finally {
    mongoClient.close();
  }

  return samplesArray;
}

export async function createSample(request: NextRequest) {
  let mongoClient: MongoClient = new MongoClient(URL);
  try {
      await mongoClient.connect(); 

      // fetch the body from the request (async task)
      const body:any = await request.json();

      // sanitizing input
      body.name = sanitizeHtml(body.name);
      body.description = sanitizeHtml(body.description);
      body.url = sanitizeHtml(body.url);
      // hard coding the images for our lesson sample
      body.images = [{"filename":"image11.png"},{"filename":"image12.png"},{"filename":"image13.png"},{"filename":"image14.png"}];

      // insert new document into DB
      let result:InsertOneResult = await mongoClient.db(DB_NAME).collection<Sample>(COLLECTION_NAME).insertOne(body);

      // returning response and setting status code to 200
      return NextResponse.json(result, {status: 200});

  } catch (error:any) {
      return NextResponse.json({error: error.message}, {status: 500});
  } finally {
      mongoClient.close();
  }
}