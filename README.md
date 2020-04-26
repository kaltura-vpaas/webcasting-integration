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
| pushPublishEnabled  | enum  | KalturaLivePublishStatus.DISABLED | enable for multicasting only |

### Optional Parameters 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| conversionProfileId  | int  | ID of desired conversion profile | cloud transcoding vs passthrough |
| tags  | string  | tags | TODO: what are possible tags for the liveStream? |



***explicitLive**: If set to true, only a KS with the `restrictexplicitliveview` privilege will be allowed to watch the stream before it is live, which is determined by the `isLive` flag. If set to false, `isLive` will be set automatically when the broadcast begins. 

***conversionProfileId**: Leave this out for Cloud Transcode (default). For passthrough method, 
call [`conversionProfile.list`](https://developer.kaltura.com/console/service/conversionProfile/action/list) API with a filter of `typeEqual = KalturaConversionProfileType.LIVE_STREAM[2]` to find the ID for Passthrough_Live profile. 

-----

### RecordingOptions 

We'll also add a RecordingOptions object with these parameters: 

| Parameter  | Type  | Value  | Description |
|---|---|---|---|
| shouldCopyEntitlement  | enum  | KalturaNullableBoolean.TRUE_VALUE | copy user entitlement settings from Live entry to Recorded VOD entry |
| shouldMakeHidden  | boolean  | true | hide the VOD entry in KMC, to only be accessible via the Live entry |




## Launching the Webcasting Studio App 
for presenters and speakers 

## Multi-Presenters 

## Using your own encoder 

## Using your own live stream 

## Loading the Video Player 

## Q&A 

## Real Time Analytics 

## Accessing The Event Recording 
