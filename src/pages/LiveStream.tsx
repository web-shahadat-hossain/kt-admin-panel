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
      ?.enumerateDevices()
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

  const location = useLocation();

  // Function to execute when the path changes or the tab/browser closes
  const handleExit = () => {
    stopStream();
    console.log('User is leaving the page or changing the route...');
    // You can make an API call here if needed
  };

  useEffect(() => {
    // Handle browser close or refresh
    const handleBeforeUnload = (event) => {
      handleExit();
      event.preventDefault();
      event.returnValue = ''; // Some browsers require this for the event to trigger
    };

    // Listen for browser/tab close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleExit(); // This will be triggered on route change
    };
  }, [location]);

  const handleFullScreen = () => {
    if (canvasRef.current.requestFullscreen) {
      canvasRef.current.requestFullscreen();
    }
  };

  return (
    <div className="flex">
      <div className="basis-2/3">
        <div className="w-full h-[70vh] relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ border: '2px solid black' }}
          />
          <div
            onClick={handleFullScreen}
            className="absolute top-[90%] right-5 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              height="24px"
              width="24px"
              version="1.1"
              id="Layer_1"
              viewBox="0 0 512 512"
            >
              <g>
                <g>
                  <path d="M0,0v512h512V0H0z M477.867,477.867H34.133V34.133h443.733V477.867z" />
                </g>
              </g>
              <g>
                <g>
                  <polygon points="126.533,102.4 199.111,102.4 199.111,68.267 68.267,68.267 68.267,199.111 102.4,199.111 102.4,126.538     198.422,222.558 222.556,198.423   " />
                </g>
              </g>
              <g>
                <g>
                  <polygon points="222.557,313.581 198.422,289.445 102.4,385.467 102.4,312.889 68.267,312.889 68.267,443.733 199.111,443.733     199.111,409.6 126.538,409.6   " />
                </g>
              </g>
              <g>
                <g>
                  <polygon points="409.6,312.889 409.6,385.467 313.578,289.444 289.444,313.578 385.462,409.6 312.889,409.6 312.889,443.733     443.733,443.733 443.733,312.889   " />
                </g>
              </g>
              <g>
                <g>
                  <polygon points="312.889,68.267 312.889,102.4 385.467,102.4 289.444,198.423 313.578,222.558 409.6,126.538 409.6,199.111     443.733,199.111 443.733,68.267   " />
                </g>
              </g>
            </svg>
          </div>
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
            <div
              key={message.Id}
              className="flex flex-col md:flex-row gap-5 items-start md:items-center"
            >
              <p>{message.Attributes.senderName}:</p>
              <p>{message.Content}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 items-center p-4 bg-gray-100 rounded-lg">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
