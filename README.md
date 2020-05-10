# webcasting-integration

The Kaltura Webcasting Integration allows you to live-stream events, videos, and corporate communications from within your applications. 
This guide will walk you through the steps needed to set up the Webcast Launcher and embed the video player in your webpage. 

## Before You Begin 

To get started, you'll need a Kaltura account, which you can sign up for [here](https://vpaas.kaltura.com/reg/index.php). You'll also need the webcasting module enabled on your account. Speak to your account manager or email us at vpaas@kaltura.com to get your account configured. 

### About Event Sizes 

## Creating a LiveStream Object 

In the Kaltura API, a webcast stream is represented as a [LiveStream](https://developer.kaltura.com/api-docs/General_Objects/Objects/KalturaLiveStreamEntry) object. We will create one using the [liveStream.add](https://developer.kaltura.com/console/service/liveStream/action/add) action, but there is a little bit of configuration to do first. 

We'll be creating an object with **`sourceType`** of `LIVE_STREAM[32]` with the parameters described here: 

### Required Parameters 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| name  | string  | name of livestream | name of livestream |
| description  | string  | description of livestream | description of livestream |
| mediaType  | enum  | KalturaMediaType.LIVE_STREAM_FLASH | indicates RTMP/RTSP source broadcast |
| dvrStatus  | enum  | KalturaDVRStatus.ENABLED | enable or disable DVR |
| dvrWindow  | int  | 60 | length of the DVR (minutes) |
| recordStatus  | enum  | KalturaRecordStatus.PER_SESSION | individual recording per event / append all events to one recording / disable recording |
| adminTags  | enum  | "kms-webcast-event" | required for analytics to track source |
| pushPublishEnabled  | enum  | KalturaLivePublishStatus.DISABLED | required for analytics to track source |
| explicitLive  | enum  | KalturaNullableBoolean.TRUE_VALUE | determines whether admins can preview the stream before going live* |

### Optional Parameters 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| conversionProfileId  | int  | ID of desired conversion profile | cloud transcoding vs passthrough |
| tags  | string  | tags | TODO: what are possible tags for the liveStream? |
| recordedEntryId | string  | entryId | TODO |




***explicitLive**: If set to true, only a KS with the `restrictexplicitliveview` privilege will be allowed to watch the stream before it is live, which is determined by the `isLive` flag. If set to false, `isLive` will be set automatically when the broadcast begins. 

***conversionProfileId**: Leave this out for Cloud Transcode (default). For passthrough method, 
call [`conversionProfile.list`](https://developer.kaltura.com/console/service/conversionProfile/action/list) API with a filter of `typeEqual = KalturaConversionProfileType.LIVE_STREAM[2]` to find the ID for Passthrough_Live profile. 

-----

### RecordingOptions 

We'll also add a RecordingOptions object with these parameters: 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| shouldCopyEntitlement  | enum  | KalturaNullableBoolean.TRUE_VALUE | copy user entitlement settings from Live entry to Recorded VOD entry |
| shouldMakeHidden  | enum  | KalturaNullableBoolean.TRUE_VALUE | hide the VOD entry in KMC, to only be accessible via the Live entry |

Finally, the API call takes the webcastEntry we just created, and the `**sourceType**` of LIVE_STREAM, resulting in something that looks like this: 

### Example 

```python
live_stream_entry = KalturaLiveStreamEntry()
live_stream_entry.name = "Webcast Tutorial"
live_stream_entry.description = "This is a test webcast"
live_stream_entry.mediaType = KalturaMediaType.LIVE_STREAM_FLASH
live_stream_entry.dvrStatus = KalturaDVRStatus.ENABLED
live_stream_entry.dvrWindow = 60
live_stream_entry.sourceType = KalturaSourceType.LIVE_STREAM
live_stream_entry.adminTags = "kms-webcast-event"
live_stream_entry.pushPublishEnabled = KalturaLivePublishStatus.DISABLED

live_stream_entry.recording_status = KalturaRecordingStatus::ACTIVE
live_stream_entry.explicitLive = KalturaNullableBoolean.TRUE_VALUE
live_stream_entry.recordStatus = KalturaRecordStatus.PER_SESSION

live_stream_entry.recordingOptions = KalturaLiveEntryRecordingOptions()
live_stream_entry.recordingOptions.shouldCopyEntitlement = KalturaNullableBoolean.TRUE_VALUE
live_stream_entry.recordingOptions.shouldMakeHidden = KalturaNullableBoolean.TRUE_VALUE

source_type = KalturaSourceType.LIVE_STREAM

result = client.liveStream.add(live_stream_entry, source_type)

```

The result is a KalturaLiveStreamEntry object and looks something like this:

### Result 

```json
{
  "bitrates": [
    {
      "bitrate": 900,
      "width": 640,
      "height": 480,
      "tags": "source,ingest,web,mobile,ipad,ipadnew",
      "objectType": "KalturaLiveStreamBitrate"
    }
  ],
  "primaryBroadcastingUrl": "rtmp://1_yo43efjn.p.kpublish.kaltura.com:1935/kLive?t=6c1ac379",
  "secondaryBroadcastingUrl": "rtmp://1_yo43efjn.b.kpublish.kaltura.com:1935/kLive?t=6c1ac379",
  "primarySecuredBroadcastingUrl": "rtmps://1_yo43efjn.p.kpublish.kaltura.com:443/kLive?t=6c1ac379",
  "secondarySecuredBroadcastingUrl": "rtmps://1_yo43efjn.b.kpublish.kaltura.com:443/kLive?t=6c1ac379",
  "primaryRtspBroadcastingUrl": "rtsp://1_yo43efjn.p.s.kpublish.kaltura.com:554/kLive/1_yo43efjn_%i?t=6c1ac379",
  "secondaryRtspBroadcastingUrl": "rtsp://1_yo43efjn.b.s.kpublish.kaltura.com:554/kLive/1_yo43efjn_%i?t=6c1ac379",
  "streamName": "1_yo43efjn_%i",
  "streamPassword": "6c1ac379",
  "recordStatus": 2,
  "dvrStatus": 1,
  "dvrWindow": 6,
  "lastElapsedRecordingTime": 0,
  "liveStreamConfigurations": [
    

  ],
  "currentBroadcastStartTime": 0,
  "recordingOptions": {
    "shouldCopyEntitlement": true,
    "shouldMakeHidden": true,
    "shouldAutoArchive": false,
    "objectType": "KalturaLiveEntryRecordingOptions"
  },
  "liveStatus": 0,
  "segmentDuration": 6000,
  "explicitLive": true,
  "viewMode": 0,
  "recordingStatus": 2,
  "lastBroadcastEndTime": 0,
  "mediaType": 201,
  "conversionQuality": 5195112,
  "sourceType": "32",
  "flavorParamsIds": "32,33,34,35",
  "plays": 0,
  "views": 0,
  "duration": 0,
  "msDuration": 0,
  "id": "1_yo43efjn",
  "name": "Webcast Tutorial",
  "description": "This is a test webcast",
  "partnerId": 1234567,
  "userId": "avital.tzubeli@kaltura.com",
  "creatorId": "avital.tzubeli@kaltura.com",
  "adminTags": "kms-webcast-event",
  "status": 2,
  "moderationStatus": 6,
  "moderationCount": 0,
  "type": 7,
  "createdAt": 1588010180,
  "updatedAt": 1588010180,
  "rank": 0,
  "totalRank": 0,
  "votes": 0,
  "downloadUrl": "https://cdnsecakmi.kaltura.com/p/2365491/sp/236549100/raw/entry_id/1_yo43efjn/version/0",
  "searchText": "_PAR_ONLY_ _2365491_ _MEDIA_TYPE_201|  Webcast Tutorial This is a test webcast kms-webcast-event",
  "licenseType": -1,
  "version": 0,
  "thumbnailUrl": "https://cfvod.kaltura.com/p/2365491/sp/236549100/thumbnail/entry_id/1_yo43efjn/version/0",
  "accessControlId": 2429431,
  "replacementStatus": 0,
  "partnerSortValue": 0,
  "conversionProfileId": 5195112,
  "rootEntryId": "1_yo43efjn",
  "operationAttributes": [],
  "entitledUsersEdit": "",
  "entitledUsersPublish": "",
  "entitledUsersView": "",
  "capabilities": "",
  "displayInSearch": 1,
  "objectType": "KalturaLiveStreamEntry"
}
```

### Metadata 

When the webcasting module is enabled on your account, two metadata profiles get created automatically. These are templates for schemas that contain information about the stream and the presenter. Once the schemas are populated, these profiles are updated on the liveStream entry that we just created. This data is needed by the webcast studio app in order to stream correctly and display presenter information. 

#### Retrieving Metadata Profiles 

The auto generated profiles are created with `system_name` KMS_KWEBCAST2 and KMS_EVENTS3. You'll need the profile ID's in order to interact with them, so we'll use the [metadataProfile.list](https://developer.kaltura.com/console/service/metadataProfile/action/list) API to filter on the name and get the respective profiles. 

```python
filter = KalturaMetadataProfileFilter()
filter.systemNameEqual = "KMS_KWEBCAST2"
pager = KalturaFilterPager()

result = client.metadata.metadataProfile.list(filter, pager)
```

You'll get a metadata profile that contains an XSD object, or XML schema, which defines the XML we'll want to create for the webcast. Learn more about [XML schemas](https://www.w3schools.com/xml/schema_intro.asp). Essentially you'll want to use tools in the language of your choice to create an XML object from the schema and add the relevant values. 

For the purpose of this guide, however, we'll work with the XML directly, to give you a better understanding of what it looks like. 

#### KMS_KWEBCAST2

The first XML is the KMS_KWEBCAST2 schema that contains the **ID of the any presentation slides**, and answers two questions about the mechanics of the livestream: 

1. **Is it a Kwebcast Entry? (boolean):**  is this an entry that is of type kwebcast
2. **Is it self serve? (boolean):** is this livestream 

These values are inserted to the XML like this: 

```xml
<?xml version=\"1.0\"?>\n<metadata><SlidesDocEntryId>123</SlidesDocEntryId><IsKwebcastEntry>1</IsKwebcastEntry><IsSelfServe>1</IsSelfServe></metadata>\n
```

and then updated using the [`metadata.add`](https://developer.kaltura.com/console/service/metadata/action/add) API like this: 

```python
metadata_profile_id = "<metadata profile ID retrieved above>"
object_type = KalturaMetadataObjectType.ENTRY
object_id = "<ID of livestream entry>"
xml_data = "<XML string>"

client.metadata.metadata.add(metadata_profile_id, object_type, object_id, xml_data)
```

#### KMS_EVENTS3

Once again, you'll need the ID of the metadata profile, which we'll retrieve using its name in the [metadataProfile.list](https://developer.kaltura.com/console/service/metadataProfile/action/list) API:

```python
filter = KalturaMetadataProfileFilter()
filter.systemNameEqual = "KMS_KWEBCAST2"
pager = KalturaFilterPager()

result = client.metadata.metadataProfile.list(filter, pager)
```

This XML contains event information, such as the start and end times (in unix timestamps), the time zone, and information about the speaker - name, title, bio, etc. 

```xml
<?xml version="1.0"?> <metadata><StartTime>1589137200</StartTime><EndTime>1589137440</EndTime><Timezone>Asia/Jerusalem</Timezone><Presenter><PresenterId>avital</PresenterId><PresenterName>Avital Tzubeli</PresenterName><PresenterTitle>Developer Advocate</PresenterTitle><PresenterBio>Awesome bio</PresenterBio><PresenterLink>https://www.linkedin.com/</PresenterLink><PresenterImage/></Presenter></metadata>
```

These details will all be displayed in the webcasting studio app. 
//TODO 

Once again, the XML is populated and added to the livestream with the [`metadata.add`](https://developer.kaltura.com/console/service/metadata/action/add) API as seen above. 








## Launching the Webcasting Studio App 
for presenters and speakers 

## Multi-Presenters 

## Using your own encoder 

## Using your own live stream 

## Loading the Video Player 

## Q&A 

## Real Time Analytics 

## Accessing The Event Recording 
