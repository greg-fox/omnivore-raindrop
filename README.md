# omnivore-raindrop
Import an Omnivore export into Raindrop

This is a node project, developed on MacOS, which uses version 16.14.2. This will run through your Omnivore exported data and create a csv file that can be imported to Raindrop. I tried to take across Omnivore highlights as well.

*NOTE*: email subscriptions in Omnivore don't work very well in Raindrop.

To use this you will need to know a bit about how to use node.

## Omnivore
Use the Omnivore export tool to get a copy of the data. When it is ready, download the zip, and extract it to a folder.

In Omnivore create an API key. You can google how to do that if you need to.

## Raindrop
Create a collection where you want the articles to land.

## .env file
Build your .env file with the following values:
```
OMNIVORE_API_KEY=<the api key>
OMNIVORE_CONTENT_FOLDER=<folder of extracted Omnivore data>
OMNIVORE_HIGHLIGHTS_FOLDER=<folder of extracted Omnivore data>/highlights
RAINDROP_FOLDER=<path to where you want your csv file to go>
RAINDROP_FOLDER_NAME=<name of collection in Raindrop>
```

## Do the conversion
`npm install`
`node convert.mjs`

Take the resulting csv file and [upload to Raindrop](https://app.raindrop.io/settings/import)
