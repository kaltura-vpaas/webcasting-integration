# webcasting-integration

The Kaltura Webcasting Integration allows you to live-stream events, videos, and corporate communications from within your applications. 
This guide will walk you through the steps needed to set up the Webcast Launcher and embed the video player in your webpage. 

## Before You Begin 

To get started, you'll need a Kaltura account, which you can sign up for [here](https://vpaas.kaltura.com/reg/index.php). You'll also need the webcasting module enabled on your account. Speak to your account manager or email us at vpaas@kaltura.com to get your account configured. 

### About Event Sizes 

## Creating a LiveStream Object 

In the Kaltura API, a webcast stream is represented as a [LiveStream](https://developer.kaltura.com/api-docs/General_Objects/Objects/KalturaLiveStreamEntry) object. We will create one using the [liveStream.add](https://developer.kaltura.com/console/service/liveStream/action/add) action, but there is a little bit of configuration to do first. 

We'll be creating an object with **`sourceType`** of `LIVE_STREAM[32]` with the parameters described here: 

### Parameters 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| name  | string  | name of livestream | name of livestream |
| description  | string  | description of livestream | description of livestream |
| mediaType  | enum  | KalturaMediaType.LIVE_STREAM_FLASH | indicates RTMP/RTSP source broadcast |
| dvrStatus  | enum  | KalturaDVRStatus.ENABLED | enable or disable DVR |
| dvrWindow  | int  | 60 | length of the DVR in minutes (max 1440) |
| recordStatus  | enum  | KalturaRecordStatus.APPENDED | individual recording per event / append all events to one recording / disable recording |
| adminTags  | enum  | "vpaas-webcast" | required for analytics to track source |
| pushPublishEnabled  | enum  | KalturaLivePublishStatus.DISABLED | required for analytics to track source |
| explicitLive  | enum  | KalturaNullableBoolean.TRUE_VALUE | determines whether admins can preview the stream before going live* |
| conversionProfileId  | int  | ID of desired conversion profile | cloud transcoding vs passthrough* |



***explicitLive**: If set to true, only a KS with the `restrictexplicitliveview` privilege will be allowed to watch the stream before it is live (determined by the `isLive` flag). If set to false, the preview will not be available to any viewers, and `isLive` will be set automatically when the broadcast begins. 

***conversionProfileId**: Use [`conversionProfile.list`](https://developer.kaltura.com/console/service/conversionProfile/action/list) with filter of `typeEqual = KalturaConversionProfileType.LIVE_STREAM[2]` to find the profile IDs for cloud transcoding or passthrough

-----

### RecordingOptions 

We'll also add a RecordingOptions object with these parameters: 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| shouldCopyEntitlement  | enum  | KalturaNullableBoolean.TRUE_VALUE | copy user entitlement settings from Live entry to Recorded VOD entry |
| shouldMakeHidden  | enum  | KalturaNullableBoolean.TRUE_VALUE | hide the VOD entry in KMC, to only be accessible via the Live entry |
| shouldAutoArchive  | enum  | KalturaNullableBoolean.TRUE_VALUE | automatically archives the recording, in order  to separate it from other live instances |

Finally, the API call takes the webcastEntry we just created, and the **`sourceType`** of `LIVE_STREAM[32]`, resulting in something that looks like this: 

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
live_stream_entry.recordingOptions.shouldAutoArchive = KalturaNullableBoolean.TRUE_VALUE

source_type = KalturaSourceType.LIVE_STREAM

result = client.liveStream.add(live_stream_entry, source_type)

```

The result is a KalturaLiveStreamEntry object that should look something like this:

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
    "shouldAutoArchive": true,
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

## Metadata 

When the webcasting module is enabled on your account, two metadata profiles get created automatically. These are templates for schemas that contain information about the stream and the presenter. Once the schemas are populated, these profiles are updated on the liveStream entry that we just created. This data is needed by the webcast studio app in order to stream correctly and display presenter information. 

#### Retrieving Metadata Profiles 

The auto-generated profiles are created with `system_name` **KMS_KWEBCAST2** and **KMS_EVENTS3**. In order to use these profiles, you'll need the specific instances found in your account, so we'll use the [metadataProfile.list](https://developer.kaltura.com/console/service/metadataProfile/action/list) API to filter on the name and get the respective profile IDs. 

```python
filter = KalturaMetadataProfileFilter()
filter.systemNameEqual = "KMS_KWEBCAST2"
pager = KalturaFilterPager()

result = client.metadata.metadataProfile.list(filter, pager)
```

You'll get a metadata profile that contains an XSD object, or [XML schema](https://www.w3schools.com/xml/schema_intro.asp), which defines the XML we'll want to create for the webcast. Essentially you'll want to use tools in the language of your choice to create an XML object from the schema and add the relevant values. 

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

That will return an object with a metadataRecordId, which you can use at any point for an update using [`metadata.update`](https://developer.kaltura.com/console/service/metadata/action/update): 

$savedMetadata = $metadataPlugin->metadata->update($metadataRecordId, $metadataXmlString);

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

These details will be associated with the liveStream and will also be displayed in the Webcasting Studio app. 

Like the first schema, the XML is populated with the relevant values and added to the livestream with the [`metadata.add`](https://developer.kaltura.com/console/service/metadata/action/add) API as seen above. 



## The Webcasting Studio App 

The admins, or person presenting, will need to download and use the Kaltura Webcasting Desktop Application. 
To launch the application, you'll need the attached [KAppLauncher script](TODO), which requires the following params: 

### Launch Params 

* **KS**: the Kaltura Session authentication string that should be used (see below)
* **ks_expiry:** the time that the KS will expire in format `YYYY-MM-DDThh:mm:ss+00:00`
* **MediaEntryId:** entry ID of the livestream
* **checkForUpdates:** whether the application should check for update (default: true)
* **uiConfId:** The uiConfId that holds data for webcasting application version, and where it needs an update. Differs for mac and windows 
* **serverAddress:** API server address (ie https://www.kaltura.com) 
* **eventsMetadataProfileId:(optional)**  ID of the metadata profile that contains presenter information
* **appName (optional):** name of the application shown on splash screen (default: "Kaltura Webcast Studio")
* **logoUrl (optional):** URL for company logo to be shown on top left of application (160 x 80 or similar ratio)
* **fromDate (optional):** start time of the event (for the progress bar in the top right) in format `YYYY-MM-DDThh:mm:ss+00:00`
* **toDate (optional):** anticipated end time of the event (for the progress bar in the top right), in format `YYYY-MM-DDThh:mm:ss+00:00`
* **userId:** username that current user is associated with
* **QnAEnabled:** whether `Q&A` module is enabled (default: true)
* **pollsEnabled:** whether `Polls` module is enabled (default: true)
* **userRole:** refers to KMS roles. Should be set to `adminRole`
* **playerUIConf:[optional]** used for debugging*
* **presentationConversionProfileId:** conversion profile ID used for converting presentations (see below)
* **referer:[optional]**  URL of the referring site or domain name
* **verifySSL:** if set to false, the application can get to https sites with unverified certificates. Used mainly for development (default: true)
* **selfServeEnabled:** whether the self-serve module is enabled (default: false)
* **participantsPanel:** whether to display the participants panel (default: true)
* **appHostUrl:** base-URL of the webpage hosting the site. Used to open links to external entry data
* **myHostingAppName:** simple alpha-numeric string that represents the hosting application's name


### Creating a Kaltura Session for a Studio Launch 

You'll create a type USER session using the [`session.start`](https://developer.kaltura.com/console/service/session/action/start) API, with privileges to the given entry and role of WEBCAST_PRODUCER_DEVICE_ROLE. 

Partner ID and Admin Secret can be found in your KMC [Integration Settings](https://kmc.kaltura.com/index.php/kmcng/settings/integrationSettings). 

Assuming a livestreamEntry ID of `1_yo43efjn`, Kaltura Session creation would look something like this:

```python
secret = "xxxxx"
user_id = "your-email-address"
k_type = KalturaSessionType.USER
partner_id = 1234567
expiry = 86400
privileges = "setrole:WEBCAST_PRODUCER_DEVICE_ROLE,sview:*,list:1_yo43efjn,download:1_yo43efjn"

result = client.session.start(secret, user_id, k_type, partner_id, expiry, privileges)
```
The above KS would give this user producer access to the entry within the Webcasting Studio. 

#### Player UiConf 

Most likely you were given the correct UiConf when Webcasting was enabled on your account, but if you're not sure which it is, you can use the [uiConf.list](https://developer.kaltura.com/console/service/uiConf/action/list) API to find it. 
Just filter on `filter.nameLike = "MediaSpace Webcast Player"` and grab that ID. 

#### Presentation Conversion Profile ID

This is needed in the case that a presenter chooses to upload a presentation. *It will not work if you don't have a conversion profile ID.* 
You can find it with the [conversionProfile.list](https://developer.kaltura.com/console/service/conversionProfile/action/list) API, by grabbing the first item in the results. 


```python
filter = KalturaConversionProfileFilter()
pager = KalturaFilterPager()

result = client.conversionProfile.list(filter, pager)

first_item = vars(result)['objects'][0]
conversion_profile_id = vars(first_item).get("id")
```

>`vars()` is a python function that uses an module's `dict` attribute to return an iterable we can work with. 

### Launching the Webcasting Studio App 

So now that you've got all your parameters, you can add a link on your webpage that will instantly open the Webcasting Studio (see instructions for download links below). 

You'll first need to load the script to the application launcher in the header of your HTML:

```html
<head>
  <script type="text/javascript" src="KAppLauncher.js"></script>
</head>
```

Create the button: 

```html 
<body>
  <button id="launchProducerApp">Launch Kaltura Webcast App</button>
</body>
```

And then the javascript code will activate the button and create a new Launcher object, then start the application with all of the parameters. 

```javascript 
document.getElementById("launchProducerApp").onclick = launchKalturaWebcast;

function launchKalturaWebcast() {
    var kapp = new KAppLauncher();

    var params = {
        'ks' => <KALTURA SESSION>,
        'ks_expiry' => <EXPIRY DATE 'Y-m-d\TH:i:sP'>,
        'MediaEntryId' => <LIVESTEAM ENTRY>,
        'uiConfID' => <MAC OR WIN UI CONF>,
        'serverAddress' => <SERVICE URL>,
        'eventsMetadataProfileId' => <KMS_EVENTS3 ID>,
        'kwebcastMetadataProfileId' => <KMS_KWEBCAST2 ID>,
        'appName' => <APP NAME>,
        'logoUrl' => <URL OF COMPANY LOGO>,
        'fromDate' => <START TIME 'Y-m-d\TH:i:sP'>,
        'toDate' => <END TIME 'Y-m-d\TH:i:sP'>,
        'userId' => <USER ID>,
        'QnAEnabled' => <TRUE / FALSE>,
        'pollsEnabled' => <TRUE / FALSE>,
        'userRole' => "adminRole", 
        'playerUIConf' => <PLAYER ID>,
        'presentationConversionProfileId' => <CONVERSION PROFILE ID>,
        'referer' => <REFERRING SITE>,
        'debuggingMode' => false, 
        'verifySSL' => true,
        'selfServeEnabled' => <TRUE / FALSE>,
        'appHostUrl' => <APP HOST URL>,
        'instanceProfile' => <HOSTING APP NAME>
        };
    
    kapp.startApp(params, function(isSupported, failReason) {
        if (!isSupported && failReason !== 'browserNotAware') {
            alert(res + " " + reason);
        } 
    }, 3000, true);
}
```





#### Creating Download Links 




## Multi-Presenters 

## Using your own encoder 

## Using your own live stream 

## Loading the Video Player 

## Q&A 

## Real Time Analytics 

## Accessing The Event Recording 
