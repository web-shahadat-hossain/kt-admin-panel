import React, { useEffect, useRef, useState } from 'react';
import IVSBroadcastClient, { BASIC_LANDSCAPE } from 'amazon-ivs-web-broadcast';
import {
  ApiBaseurl,
  START_STREAM,
  STOP_STREAM,
} from '@/utils/constants/ApiEndPoints';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const LiveStream = () => {
  const { state } = useLocation();
  const canvasRef = useRef(null);
  const [broadcastClient, setBroadcastClient] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const { toast } = useToast();
  const navigate = useNavigate();
  const chatWebSocket = useRef(null);

  useEffect(() => {
    // Initialize Amazon IVS Broadcast Client
    const client = IVSBroadcastClient.create({
      streamConfig: BASIC_LANDSCAPE, // Stream in landscape mode
      ingestEndpoint: `rtmps://${state?.ingestUrl}/app/`,
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
              x: -200, // X position (0 is left)
              y: 0, // Y position (0 is top)
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
    try {
      const response = await axios.post(
        ApiBaseurl + START_STREAM(state?._id),
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );

      if (broadcastClient) {
        await broadcastClient.startBroadcast(state?.streamId);
        connectToChat();
        setIsStreaming(true);
      }

      toast({
        title: 'Toast Created',
        description: 'The Live is Started successfully',
      });
    } catch (error) {
      toast({
        title: 'Live error',
        description: error.response.data.error || 'Something went wrong',
      });
    }
  };

  const stopStream = async () => {
    try {
      const response = await axios.post(
        ApiBaseurl + STOP_STREAM,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      if (broadcastClient) {
        await broadcastClient.stopBroadcast();
        setIsStreaming(false);
      }
      navigate('/dashboard/upcomingLive');
      toast({
        title: 'Live Stopped',
        description: 'Live stopped Successfully',
      });
    } catch (error) {
      toast({
        title: 'Live error',
        description: error.response.data.error || 'Something went wrong',
      });
    }
  };

  const connectToChat = async () => {
    const response = await axios.post(ApiBaseurl + `/stream/get-chat-token`, {
      chatRoomArn: state?.chatRoomId,
      userId: 'admin',
    });

    const { token } = response.data;

    chatWebSocket.current = new WebSocket(
      'wss://edge.ivschat.ap-south-1.amazonaws.com',
      token
    );
    chatWebSocket.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setChatMessages((prev) => [...prev, newMessage]);
    };
  };

  const sendMessage = () => {
    if (chatWebSocket.current) {
      const payload = {
        Action: 'SEND_MESSAGE',
        SenderName: 'Forhad',
        Content: message,
        attributes: {
          senderName: 'Forhad', // Custom attribute for sender name
        },
      };
      chatWebSocket.current.send(JSON.stringify(payload));
      setMessage('');
    }
  };

  return (
    <div className="flex">
      <div className="basis-2/3">
        <div className="w-full h-[70vh]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ border: '2px solid black' }}
          />
        </div>
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
      <div className="basis-1/3">
        <div className="h-[70vh] overflow-y-auto">
          {chatMessages.map((message) => (
            <div key={message.Id}>
              <p>{message.Attributes.senderName}</p>
              <p>{message.Content}</p>
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: '10px',
              margin: '10px',
              backgroundColor: 'red',
              color: 'white',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
