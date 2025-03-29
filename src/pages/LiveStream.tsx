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
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  let videoStream = useRef(null);
  let audioStream = useRef(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const chatWebSocket = useRef(null);

  useEffect(() => {
    const client = IVSBroadcastClient.create({
      streamConfig: BASIC_LANDSCAPE,
      ingestEndpoint: `rtmps://${state?.ingestUrl}/app/`,
    });

    setBroadcastClient(client);

    if (canvasRef.current) {
      client.attachPreview(canvasRef.current);
    }

    navigator.mediaDevices
      ?.enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        const audioDevices = devices.filter(
          (device) => device.kind === 'audioinput'
        );

        navigator.mediaDevices
          .getUserMedia({
            video: { deviceId: videoDevices[0]?.deviceId },
            audio: { deviceId: audioDevices[0]?.deviceId },
          })
          .then((stream) => {
            videoStream.current = stream;
            audioStream.current = stream;
            client.addVideoInputDevice(stream, 'camera1', {
              index: 0,
              width: 1280,
              height: 720,
              x: -200,
              y: 0,
            });
            client.addAudioInputDevice(stream, 'mic1');
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
      window.location.reload();
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
        // SenderName: 'Admin',
        Content: message,
        attributes: {
          senderName: 'Admin', // Custom attribute for sender name
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

  const pauseStream = () => {
    if (videoStream.current) {
      videoStream.current
        .getTracks()
        .forEach((track) => (track.enabled = !isPaused));
      setIsPaused((prev) => !prev);
    }
  };

  const toggleMute = () => {
    if (audioStream.current) {
      audioStream.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !isMuted));
      setIsMuted((prev) => !prev);
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
          <div className="flex gap-3 items-center mt-5">
            <button
              onClick={pauseStream}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
            >
              {!isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={toggleMute}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              {!isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              onClick={stopStream}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Stop Live
            </button>
          </div>
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
