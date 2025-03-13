import React, { useEffect, useRef, useState } from 'react';
import IVSBroadcastClient, { BASIC_LANDSCAPE } from 'amazon-ivs-web-broadcast';
import axios from 'axios';
import { ApiBaseurl, START_STREAM } from '@/utils/constants/ApiEndPoints';
import Cookies from 'js-cookie';

const LiveStream = () => {
  const canvasRef = useRef(null);
  const [broadcastClient, setBroadcastClient] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Replace with your Amazon IVS ingest URL and Stream Key
  const ingestEndpoint =
    'rtmps://6b879004354a.global-contribute.live-video.net:443/app/';
  const streamKey = 'sk_ap-south-1_4LeRY8OAJOep_ZX2Eci4lRcTxA8SND1PngxjmaeNKSY';

  useEffect(() => {
    // Initialize Amazon IVS Broadcast Client
    const client = IVSBroadcastClient.create({
      streamConfig: BASIC_LANDSCAPE, // Stream in landscape mode
      ingestEndpoint: ingestEndpoint,
    });

    setBroadcastClient(client);

    // Attach preview to the canvas element
    if (canvasRef.current) {
      client.attachPreview(canvasRef.current);
    }

    // Access available devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        const audioDevices = devices.filter(
          (device) => device.kind === 'audioinput'
        );

        // Get user media for the first video and audio device
        navigator.mediaDevices
          .getUserMedia({
            video: { deviceId: videoDevices[0]?.deviceId },
            audio: { deviceId: audioDevices[0]?.deviceId },
          })
          .then((stream) => {
            client.addVideoInputDevice(stream, 'camera1', {
              index: 0, // Position in the composition (z-index)
              width: 1280, // Width in pixels
              height: 720, // Height in pixels
              x: 0, // X position (0 is left)
              y: 0, // Y position (0 is top)
              zIndex: 1, // Layer order
              opacity: 1.0, // Opacity (1.0 is fully opaque)
              scaleMode: 'FILL', // Scaling mode: 'FILL', 'FIT', or 'CROP'
            });
            client.addAudioInputDevice(stream, 'mic1');
            // console.log('stream', stream);
          })
          .catch((error) =>
            console.error('Error accessing media devices:', error)
          );
      })
      .catch((error) => console.error('Error enumerating devices:', error));

    return () => {
      client.stopBroadcast();
    };
  }, []);

  const startStream = async () => {
    if (broadcastClient) {
      try {
        await broadcastClient.startBroadcast(streamKey);
        console.log('Live stream started!');
        setIsStreaming(true);
      } catch (error) {
        console.error('Failed to start stream:', error);
      }
    }
  };

  // const startStream = async (streamKey: string, id: string) => {
  //   if (broadcastClient) {
  //     try {
  //       // First try to start the broadcast client
  //       await broadcastClient.startBroadcast(streamKey);
  //       console.log('Live stream started!');
  //       setIsStreaming(true);

  //       // Get auth token from cookies
  //       const authToken = Cookies.get('authToken');

  //       if (!authToken) {
  //         console.error('Auth token not found in cookies');
  //         return;
  //       }

  //       // Then notify your backend API that the stream has started
  //       try {
  //         const response = await axios.post(
  //           `${ApiBaseurl}${START_STREAM(id)}`,
  //           {
  //             title:
  //             streamKey: streamKey,
  //             isActive: true,
  //             startedAt: new Date().toISOString(),
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${authToken}`,
  //               'Content-Type': 'application/json',
  //             },
  //           }
  //         );

  //         console.log('Backend notified of stream start:', response.data);

  //         // You might want to handle the response accordingly
  //         if (response.data.success) {
  //           console.log('Stream successfully registered with backend');
  //         }
  //       } catch (apiError) {
  //         console.error('Failed to notify backend of stream start:', apiError);
  //         // You might want to handle this error (perhaps the stream continues but backend isn't notified)
  //       }
  //     } catch (streamError) {
  //       console.error('Failed to start stream:', streamError);
  //       setIsStreaming(false);

  //       // Get auth token from cookies
  //       const authToken = Cookies.get('authToken'); // Replace 'authToken' with your actual cookie name

  //       // Optionally notify backend of failed attempt
  //       if (authToken) {
  //         try {
  //           await axios.post(
  //             `${ApiBaseurl}${START_STREAM(id)}`,
  //             {
  //               streamKey: streamKey,
  //               isActive: false,
  //               error: streamError.message,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${authToken}`,
  //                 'Content-Type': 'application/json',
  //               },
  //             }
  //           );
  //         } catch (notifyError) {
  //           console.error(
  //             'Failed to notify backend of stream error:',
  //             notifyError
  //           );
  //         }
  //       }
  //     }
  //   } else {
  //     console.error('Broadcast client not initialized');
  //   }
  // };

  const stopStream = async () => {
    if (broadcastClient) {
      await broadcastClient.stopBroadcast();
      console.log('Live stream stopped!');
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <h2>Admin Live Stream</h2>
      {/* Use canvasRef */}
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        style={{ border: '2px solid black' }}
      />
      <br />
      {!isStreaming ? (
        <button
          onClick={startStream}
          style={{
            padding: '10px',
            margin: '10px',
            backgroundColor: 'ButtonText',
            color: 'white',
          }}
        >
          Start Live
        </button>
      ) : (
        <button
          onClick={stopStream}
          style={{
            padding: '10px',
            margin: '10px',
            backgroundColor: 'red',
            color: 'white',
          }}
        >
          Stop Live
        </button>
      )}
    </div>
  );
};

export default LiveStream;
