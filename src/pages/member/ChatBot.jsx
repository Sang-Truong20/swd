import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBalanceScale, FaPaperPlane, FaTimes, FaUser, FaVolumeUp } from 'react-icons/fa';
import { chatWithGemini, getChatHistory } from '../../services/chat';
import { formatDateChatBot, getDateKey } from '../../utils/index';
import { quickOptions } from './constants/index';

export const formatMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={index}>{content}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceChatMode, setIsVoiceChatMode] = useState(false); // Track voice chat mode
  const recognitionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  // ref cho container chat và textarea để xử lý scroll và focus input
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null); // url audio đang phát
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingMessageText, setCurrentPlayingMessageText] = useState(null); // Track tin nhắn nào đang phát audio
  const audioRef = useRef(null); // ref cho audio element
  const webAudioActiveRef = useRef(false); // flag để ngăn multiple Web Audio API calls
  const webAudioSourceRef = useRef(null); // ref cho Web Audio API source để có thể dừng

  // Viettel AI TTS Configuration
  const VIETTEL_TTS_CONFIG = {
    url: 'https://viettelai.vn/tts/speech_synthesis',
    token: 'df7e2feb9fb27090083dadcb79db543f',
    voice: 'hn-quynhanh', // Giọng nữ miền Bắc - Quỳnh Anh
    speed: 1.0,
    tts_return_option: 3, // MP3 format
    without_filter: false
  };

  const userId = localStorage.getItem('userId');

  // lấy lịch sử chat
  const { data: messagesList } = useQuery({
    queryKey: ['chatHistory', userId],
    queryFn: () => getChatHistory(userId),
    enabled: !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    retry: 3,
  });

  const listMessage = (messagesList && messagesList.data) || [];

  // convert danh sách tin nhắn thành dạng data để map (theo ngày, phân biệt người gửi (bot/user))
  const transformedMessages = useMemo(() => {
    const groupedMessages = [];
    let lastDateKey = null;

    // sắp xếp tin nhắn theo thời gian
    const sortedMessages = [...listMessage].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );

    sortedMessages.forEach((msg) => {
      const dateKey = getDateKey(msg.timestamp);
      const time = new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Thêm separator ngày nếu khác ngày
      if (dateKey !== lastDateKey) {
        groupedMessages.push({
          type: 'date',
          date: formatDateChatBot(msg.timestamp),
          timestamp: msg.timestamp,
        });
        lastDateKey = dateKey;
      }

      // tin nhắn user
      groupedMessages.push({
        type: 'message',
        sender: 'me',
        text: msg.question,
        time,
        timestamp: msg.timestamp,
      });

      // tin nhắn bot
      groupedMessages.push({
        type: 'message',
        sender: 'other',
        text: msg.answer,
        time,
        timestamp: msg.timestamp,
      });
    });

    return groupedMessages;
  }, [listMessage]);

  // focus vào textarea nhập tin nhắn
  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Hàm Text-to-Speech sử dụng Viettel AI TTS API (chất lượng cao)
  const speakWithViettelTTS = async (text) => {
    try {
      // Kiểm tra độ dài text
      if (text.length > 2000) {
        text = text.substring(0, 2000);
      }
      
      // Kiểm tra text ít nhất 3 ký tự
      if (text.length < 3) {
        alert('Nội dung quá ngắn để chuyển đổi thành giọng nói');
        return;
      }

      // Dừng audio đang phát (nếu có)
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Reset Web Audio API flag
      webAudioActiveRef.current = false;
      webAudioSourceRef.current = null;

      // Thiết lập trạng thái đang loading
      setIsPlaying(true);
      setAudioUrl('loading');
      setCurrentPlayingMessageText(text); // Track tin nhắn đang phát

      console.log('Đang gọi Viettel TTS API với text:', text.substring(0, 50) + '...');

      // Gọi Viettel AI TTS API
      const response = await fetch(VIETTEL_TTS_CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          text: text,
          voice: VIETTEL_TTS_CONFIG.voice,
          speed: VIETTEL_TTS_CONFIG.speed,
          tts_return_option: VIETTEL_TTS_CONFIG.tts_return_option,
          token: VIETTEL_TTS_CONFIG.token,
          without_filter: VIETTEL_TTS_CONFIG.without_filter
        })
      });

      console.log('Viettel TTS Response Status:', response.status);
      console.log('Viettel TTS Response Headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.vi_message || errorData.en_message || 'Lỗi API Viettel TTS');
      }

      // Kiểm tra content-type
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      // Tạo audio từ response blob
      const audioBlob = await response.blob();
      console.log('Audio Blob size:', audioBlob.size, 'bytes');
      console.log('Audio Blob type:', audioBlob.type);
      
      if (audioBlob.size === 0) {
        throw new Error('File audio rỗng từ Viettel TTS');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL đã tạo:', audioUrl);
      
      // Tạo audio element và phát
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Thiết lập volume và preload
      audio.volume = 1.0;
      audio.preload = 'auto';
      audio.muted = false; // Đảm bảo không bị mute
      
      // Kiểm tra Audio Context (Chrome policy)
      if (typeof AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        if (audioContext.state === 'suspended') {
          console.log('🔊 Audio Context suspended, trying to resume...');
          try {
            await audioContext.resume();
            console.log('✅ Audio Context resumed successfully');
          } catch (e) {
            console.warn('⚠️ Could not resume Audio Context:', e);
          }
        }
      }
      
      audio.onloadstart = () => {
        console.log('✅ Audio loadstart - Đang tải audio từ Viettel TTS...');
      };

      audio.onloadedmetadata = () => {
        console.log('✅ Audio loadedmetadata - Metadata đã load');
        console.log('⏱️ Audio duration after metadata:', audio.duration);
        console.log('🔊 Audio volume after metadata:', audio.volume);
        
        // Nếu duration vẫn là NaN, có thể có vấn đề với file
        if (isNaN(audio.duration)) {
          console.warn('⚠️ Audio duration là NaN - có vấn đề với file MP3');
          // Thử set lại volume và muted
          audio.volume = 1.0;
          audio.muted = false;
        }
      };

      audio.onloadeddata = () => {
        console.log('✅ Audio loadeddata - Dữ liệu audio đã load');
      };
      
      audio.oncanplay = () => {
        console.log('✅ Audio canplay - Sẵn sàng phát audio');
        setAudioUrl(audioUrl);
      };

      audio.oncanplaythrough = () => {
        console.log('✅ Audio canplaythrough - Có thể phát liên tục');
      };
      
      audio.onplay = () => {
        console.log('✅ Audio play - Bắt đầu phát audio Viettel TTS');
        console.log('🔊 Audio volume:', audio.volume);
        console.log('🔇 Audio muted:', audio.muted);
        console.log('⏱️ Audio duration:', audio.duration);
        console.log('📍 Audio currentTime:', audio.currentTime);
        setIsPlaying(true);
      };

      audio.onplaying = () => {
        console.log('✅ Audio playing - Đang phát audio');
        let resumeAttempted = false; // Flag để tránh double fallback
        
        // Thêm test để đảm bảo audio thực sự phát
        setTimeout(() => {
          console.log('⏰ Audio currentTime after 1s:', audio.currentTime);
          console.log('⏰ Audio duration after 1s:', audio.duration);
          console.log('⏰ Audio paused after 1s:', audio.paused);
          console.log('⏰ Audio readyState after 1s:', audio.readyState);
          console.log('⏰ Audio ended after 1s:', audio.ended);
          console.log('🔄 Web Audio API active:', webAudioActiveRef.current);
          
          // Chỉ xử lý nếu Web Audio API chưa active
          if (!webAudioActiveRef.current && audio.paused && !audio.ended && !resumeAttempted) {
            console.warn('⚠️ Audio bị pause tự động! Thử play lại...');
            resumeAttempted = true;
            
            // Thử play lại ngay lập tức
            audio.play().then(() => {
              console.log('✅ Audio resumed successfully');
              // Nếu resume thành công, CANCEL Web Audio API nếu đang pending
              if (webAudioActiveRef.current) {
                console.log('🚫 Cancelling Web Audio API vì HTML Audio đã resume thành công');
                webAudioActiveRef.current = false;
              }
            }).catch(e => {
              console.error('❌ Resume failed:', e);
              console.log('🔄 Chuyển sang Web Audio API từ onplaying...');
              
              // Kiểm tra lại flag trước khi gọi Web Audio API
              if (!webAudioActiveRef.current) {
                webAudioActiveRef.current = true;
                
                // Dừng HTML audio hoàn toàn trước khi dùng Web Audio API
                audio.pause();
                audio.currentTime = 0;
                
                // Chuyển sang Web Audio API
                setTimeout(async () => {
                  // Double-check flag trước khi thực thi Web Audio API
                  if (!webAudioActiveRef.current) {
                    console.log('🚫 HTML Audio đã resume, bỏ qua Web Audio API');
                    return;
                  }
                  
                  try {
                    await playWithWebAudioAPI(audioBlob);
                  } catch (webAudioError) {
                    console.error('❌ Web Audio API cũng thất bại:', webAudioError);
                    alert('Không thể phát audio. Có thể do:\n1. Browser policy chặn audio\n2. Audio focus bị mất\n3. Conflict với audio khác');
                  }
                }, 200); // Tăng delay để cho HTML Audio có cơ hội resume
              } else {
                console.log('🚫 Web Audio API đã active, bỏ qua...');
              }
            });
          } else if (!webAudioActiveRef.current && audio.currentTime === 0 && !audio.paused && !audio.ended && !resumeAttempted) {
            console.warn('⚠️ Audio không di chuyển! Có thể có vấn đề với audio output');
            console.log('🔄 Thử phương pháp khác...');
            resumeAttempted = true;
            
            // Thử pause rồi play lại
            audio.pause();
            setTimeout(() => {
              audio.currentTime = 0;
              audio.play().catch(e => console.error('❌ Retry play failed:', e));
            }, 100);
          }
        }, 1000);
        
        // Bỏ check sau 2s để tránh double fallback
        // setTimeout async đã được bỏ để tránh conflict
      };
      
      audio.onpause = () => {
        console.log('⏸️ Audio paused - Audio bị dừng');
        console.log('⏸️ Audio currentTime when paused:', audio.currentTime);
        console.log('⏸️ Audio ended when paused:', audio.ended);
        
        // Nếu audio bị pause mà chưa ended và currentTime > 0, có thể do browser policy
        if (!audio.ended && audio.currentTime < audio.duration * 0.1) {
          console.warn('⚠️ Audio bị pause quá sớm - có thể do browser policy');
        }
      };

      audio.onended = () => {
        console.log('✅ Audio ended - Kết thúc phát audio');
        setIsPlaying(false);
        setAudioUrl(null);
        setCurrentPlayingMessageText(null); // Clear tracking
        URL.revokeObjectURL(audioUrl); // Cleanup
      };
      
      audio.onerror = (error) => {
        console.error('❌ Audio error:', error);
        console.error('❌ Audio error details:', audio.error);
        alert('Lỗi phát audio. Có thể do trình duyệt chặn autoplay hoặc file audio lỗi.');
        setIsPlaying(false);
        setAudioUrl(null);
        setCurrentPlayingMessageText(null); // Clear tracking
        URL.revokeObjectURL(audioUrl);
      };

      // Thử phát audio với xử lý autoplay policy
      try {
        console.log('🎵 Đang thử phát audio...');
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Audio đã phát thành công');
          
          // Kiểm tra ngay sau khi play xem có bị pause không - nhưng không trigger Web Audio API ngay
          setTimeout(() => {
            if (audio.paused && !audio.ended && !webAudioActiveRef.current) {
              console.warn('⚠️ Audio bị pause ngay sau khi play! Chuyển sang Web Audio API...');
              webAudioActiveRef.current = true;
              
              // Dừng HTML audio hoàn toàn
              audio.pause();
              audio.currentTime = 0;
              
              playWithWebAudioAPI(audioBlob).catch(e => {
                console.error('❌ Emergency Web Audio API failed:', e);
              });
            } else if (audio.paused && !audio.ended && webAudioActiveRef.current) {
              console.log('🚫 Audio paused nhưng Web Audio API đã active, bỏ qua...');
            }
          }, 100);
        }
      } catch (playError) {
        console.error('❌ Lỗi autoplay:', playError);
        
        // Nếu bị chặn autoplay, thử Web Audio API ngay lập tức
        if (playError.name === 'NotAllowedError') {
          console.log('🔄 AutoPlay bị chặn, thử Web Audio API ngay...');
          webAudioActiveRef.current = true;
          try {
            await playWithWebAudioAPI(audioBlob);
          } catch (webAudioError) {
            console.error('❌ Web Audio API backup failed:', webAudioError);
            alert('Trình duyệt chặn tự động phát audio. Vui lòng click vào trang web trước rồi thử lại.');
          }
        } else {
          console.log('🔄 Play error, trying Web Audio API...');
          webAudioActiveRef.current = true;
          try {
            await playWithWebAudioAPI(audioBlob);
          } catch (webAudioError) {
            console.error('❌ Web Audio API backup failed:', webAudioError);
            alert(`Lỗi phát audio: ${playError.message}`);
          }
        }
        
        setIsPlaying(false);
        setAudioUrl(null);
        setCurrentPlayingMessageText(null); // Clear tracking
        URL.revokeObjectURL(audioUrl);
      }

    } catch (err) {
      console.error('❌ Viettel TTS Error:', err);
      alert(`Lỗi Viettel TTS: ${err.message || 'Vui lòng thử lại.'}`);
      setIsPlaying(false);
      setAudioUrl(null);
      setCurrentPlayingMessageText(null); // Clear tracking
    }
  };

  // Fallback method sử dụng Web Audio API
  const playWithWebAudioAPI = async (audioBlob) => {
    try {
      console.log('🎵 Bắt đầu Web Audio API playback...');
      
      // Set flag để ngăn multiple calls
      webAudioActiveRef.current = true;
      
      // Dừng hoàn toàn HTML Audio element để tránh conflict
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null; // Loại bỏ reference
      }
      
      const AudioContextClass = AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      console.log('🔊 AudioContext state:', audioContext.state);
      
      if (audioContext.state === 'suspended') {
        console.log('🔊 Resuming AudioContext...');
        await audioContext.resume();
      }
      
      console.log('📊 Decoding audio data...');
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      console.log('✅ Audio decoded successfully');
      console.log('⏱️ Audio buffer duration:', audioBuffer.duration);
      console.log('📢 Audio buffer channels:', audioBuffer.numberOfChannels);
      console.log('🔊 Audio buffer sample rate:', audioBuffer.sampleRate);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Lưu reference để có thể dừng từ bên ngoài
      webAudioSourceRef.current = source;
      
      // Thêm gain node để control volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      source.onended = () => {
        console.log('✅ Web Audio API playback ended');
        setIsPlaying(false);
        setAudioUrl(null);
        setCurrentPlayingMessageText(null); // Clear tracking
        webAudioActiveRef.current = false; // Reset flag khi kết thúc
        webAudioSourceRef.current = null; // Clear reference
        audioContext.close();
      };
      
      source.start(0);
      console.log('✅ Web Audio API started successfully');
      
      // Update UI
      setIsPlaying(true);
      setAudioUrl('web-audio-api');
      
    } catch (error) {
      console.error('❌ Web Audio API error:', error);
      console.error('❌ Error details:', error.message);
      webAudioActiveRef.current = false; // Reset flag khi lỗi
      webAudioSourceRef.current = null; // Clear reference
      throw error;
    }
  };  // Xử lý audio element lifecycle
  useEffect(() => {
    // Cleanup function khi component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl && audioUrl !== 'loading') {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Hàm dừng phát audio
  const handleStopAudio = () => {
    console.log('🛑 Dừng tất cả audio...');
    
    // Dừng HTML Audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log('🛑 HTML Audio đã dừng');
    }
    
    // Dừng Web Audio API
    if (webAudioSourceRef.current) {
      try {
        webAudioSourceRef.current.stop();
        webAudioSourceRef.current = null;
        console.log('🛑 Web Audio API đã dừng');
      } catch (e) {
        console.warn('⚠️ Web Audio API đã kết thúc hoặc không thể dừng:', e);
      }
    }
    
    // Reset states
    webAudioActiveRef.current = false;
    setIsPlaying(false);
    setAudioUrl(null);
    setCurrentPlayingMessageText(null); // Clear tracking
  };

  // Voice recognition
  const handleVoiceClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      
      // Đánh dấu đang trong Voice Chat mode
      setIsVoiceChatMode(true);
      
      console.log('🎤 Voice Chat detected:', transcript);
      
      // Tự động gửi tin nhắn sau khi nhận diện xong (với flag autoRead)
      setTimeout(() => {
        handleSend(transcript, true); // true = autoRead
        setInput(''); // Clear input sau khi gửi
      }, 500); // Delay nhỏ để user thấy text trước khi gửi
    };
    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // scoll xuống cuối khung chat
  const scrollToBottom = (force = false) => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const clientHeight = chatContainerRef.current.clientHeight;
      const scrollTop = chatContainerRef.current.scrollTop;

      if (force || scrollHeight - scrollTop - clientHeight < 100) {
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  // cập nhật tin nhắn khi có dữ liệu mới hoặc khởi tạo lần đầu
  useEffect(() => {
    if (listMessage.length > 0) {
      const newMessages = transformedMessages;

      const isDifferent =
        newMessages.length !== messages.length ||
        newMessages.some((msg, i) => msg.timestamp !== messages[i]?.timestamp);

      if (isDifferent) {
        setMessages(newMessages);
        const hasUserMessage = transformedMessages.some(
          (msg) => msg.type === 'message' && msg.sender === 'me',
        );
        if (hasUserMessage) {
          setHasUserSentMessage(true);
        }

        if (!isInitialized) {
          setIsInitialized(true);
          setTimeout(() => {
            scrollToBottom(true);
            focusTextarea();
          }, 100);
        }
      }
    } else if (messages.length === 0) {
      // tin nhắn mới vào khi chưa có lịch sử chat
      const initialMessage = {
        type: 'message',
        sender: 'other',
        text: 'Xin chào! Tôi là SmartLaw AI - Trợ lý tư vấn pháp luật thông minh. Tôi có thể giúp bạn với các vấn đề về luật giao thông, dân sự, hình sự, lao động và nhiều lĩnh vực khác. Bạn cần tư vấn về vấn đề gì?',
        time: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: new Date().toISOString(),
      };

      setMessages([initialMessage]);
      setIsInitialized(true);
      setTimeout(() => {
        scrollToBottom(true);
        focusTextarea();
      }, 100);
    }
  }, [listMessage, transformedMessages]);

  // tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      setTimeout(() => scrollToBottom(true), 50);
    }
  }, [messages, isInitialized]);

  // hiển thị animation khi mở chat bot
  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => {
      setShowAnimation(false);
      focusTextarea();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // tự động điều chỉnh chiều cao textarea khi nhập
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  // xử lý gửi tin nhắn
  const handleSend = async (message = input, autoRead = false) => {
    if (!message.trim() || isLoading) return;

    // đánh dấu rằng người dùng đã gửi ít nhất một tin nhắn
    setHasUserSentMessage(true);

    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // lấy tin nhắn cuối cùng trong danh sách tin nhắn
    const lastMessage = messages[messages.length - 1];

    // xác định xem có cần hiển thị dải phân cách ngày mới hay không
    const needDateSeparator =
      lastMessage &&
      getDateKey(now.toISOString()) !== getDateKey(lastMessage.timestamp);

    // tạo mảng tin nhắn mới dựa trên tin nhắn hiện tại
    const newMessages = [...messages];

    // nếu cần dải phân cách ngày thì thêm vào (Hôm nay / Hôm qua / Ngày khác)
    if (needDateSeparator) {
      newMessages.push({
        type: 'date',
        date: formatDateChatBot(now.toISOString()),
        timestamp: now.toISOString(),
      });
    }

    // thêm tin nhắn của người dùng vào danh sách
    newMessages.push({
      type: 'message',
      sender: 'me',
      text: message.trim(),
      time,
      timestamp: now.toISOString(),
    });

    // cập nhật danh sách tin nhắn và reset input
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // focus lại vào khung nhập tin nhắn sau khi gửi
    setTimeout(() => {
      focusTextarea();
    }, 10);

    try {
      // gọi API để nhận phản hồi từ chatbot
      const res = await chatWithGemini(message.trim(), userId);

      // fake delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // lấy nội dung phản hồi
      const answer =
        res?.data?.answer ||
        res?.data ||
        'Không nhận được phản hồi từ hệ thống';

      setIsTyping(false);

      // thêm phản hồi từ chatbot vào danh sách tin nhắn
      setMessages((prev) => [
        ...prev,
        {
          type: 'message',
          sender: 'other',
          text: answer,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          timestamp: new Date().toISOString(),
        },
      ]);

      setTimeout(() => {
        focusTextarea();
      }, 100);
      
      // Nếu autoRead (từ voice input), tự động đọc trả lời
      if (autoRead) {
        console.log('🔊 Voice Chat: Tự động phát audio trả lời...');
        setTimeout(() => {
          speakWithViettelTTS(answer);
        }, 300); // Delay nhỏ để UI update xong
        
        // Reset voice chat mode sau khi xử lý xong
        setTimeout(() => {
          setIsVoiceChatMode(false);
        }, 1000);
      }
    } catch {
      setIsTyping(false);
      
      // Reset voice chat mode nếu có lỗi
      if (autoRead) {
        setIsVoiceChatMode(false);
      }
      
      // thêm tin nhắn báo lỗi vào danh sách (nếu cần)
      setMessages((prev) => [
        ...prev,
        {
          type: 'message',
          sender: 'other',
          text: 'Có lỗi xảy ra khi gửi câu hỏi. Vui lòng thử lại.',
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          timestamp: new Date().toISOString(),
        },
      ]);

      setTimeout(() => {
        focusTextarea();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // hỗ trợ chọn câu hỏi nhanh
  const handleQuickOption = (option) => {
    handleSend(option.query);
  };

  // xử lý gửi tin nhắn khi nhấn Enter (không giữ shift)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // khi click vào vùng chat thì focus vào textarea nếu không loading
  const handleChatContainerClick = () => {
    if (!isLoading) {
      focusTextarea();
    }
  };

  // hiển thị các câu hỏi nhanh nếu chưa gửi tin nhắn nào
  const showQuickOptions = !hasUserSentMessage;

  return (
    <div className="w-full h-full max-w-4xl mx-auto">
      <div
        className={`bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full flex flex-col overflow-hidden border-0 ${
          showAnimation ? 'animate-pulse' : ''
        }`}
      >
        {/* Dropdown chọn voice tiếng Việt */}
        {/* Xoá đoạn này:
        <div className="px-6 pt-4 pb-2 bg-white border-b border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-500">Chọn giọng đọc:</span>
          <select
            className="text-xs border rounded px-2 py-1 focus:outline-none"
            value={selectedVoice?.voiceURI || ''}
            onChange={e => {
              const v = voices.find(v => v.voiceURI === e.target.value);
              setSelectedVoice(v);
            }}
          >
            {vietnameseVoices.length > 0 ? (
              vietnameseVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            ) : (
              voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            )}
          </select>
          {vietnameseVoices.length === 0 && (
            <span className="text-xs text-red-400 ml-2">Không tìm thấy giọng tiếng Việt trên máy bạn</span>
          )}
        </div>
        */}
        <div className="relative bg-blue-700 p-6">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                  <FaBalanceScale className="text-white text-xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl tracking-wide">
                  SmartLaw AI
                </h3>
                <p className="text-sm text-white/90 flex items-center gap-2 mt-1">
                  Tư vấn pháp luật 24/7
                </p>
              </div>
            </div>
            {onClose && (
              <button
                className="p-3 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
                onClick={onClose}
                aria-label="Đóng chat bot"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            )}
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 pb-3 space-y-4 bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 cursor-text"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e5e7eb transparent',
          }}
          onClick={handleChatContainerClick}
        >
          {showQuickOptions && (
            <div className="mb-8 animate-fade-in">
              <div className="grid grid-cols-2 gap-3 mt-5">
                {quickOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickOption(option)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-3 ${option.color}`}
                  >
                    <option.icon className="text-lg" />
                    <span className="text-sm font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={index} className="flex justify-center my-6">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>
              );
            }

            const hasUsageLimit = item?.text?.includes('Số lượt còn lại');
            let mainMessage = item?.text;
            // lưu phần text liên quan đến "Số lượt còn lại"
            let usageLimitText = '';

            if (hasUsageLimit) {
              const parts = item.text.split('(Số lượt còn lại');
              mainMessage = parts[0].trim();

              if (parts[1]) {
                usageLimitText = '(Số lượt còn lại' + parts[1];
              }
            }
            return (
              <div
                key={index}
                className={`flex items-start gap-3 mt-5 ${
                  item.sender === 'me' ? 'flex-row-reverse' : ''
                } group`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    item.sender === 'me' ? 'bg-gray-600' : 'bg-blue-600'
                  }`}
                >
                  {item.sender === 'me' ? (
                    <FaUser className="text-white text-sm" />
                  ) : (
                    <FaBalanceScale className="text-white text-sm" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] ${item.sender === 'me' ? 'text-right' : ''}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 group-hover:shadow-md ${
                      item.sender === 'me'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {formatMarkdown(mainMessage)}
                    </p>
                    {/* Thay nút loa ở mỗi tin nhắn bot bằng nút gọi speakWithViettel */}
                    {item.sender === 'other' && (
                      <div className="mt-2 flex gap-2 items-center">
                        {/* Chỉ hiển thị nút "Dừng đọc" cho tin nhắn đang được phát */}
                        {audioUrl && isPlaying && currentPlayingMessageText === mainMessage ? (
                          <button
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 focus:outline-none text-xs"
                            title="Dừng đọc"
                            onClick={handleStopAudio}
                            type="button"
                          >
                            <svg className="inline-block mr-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><rect width="12" height="12" x="2" y="2" rx="2"/></svg> Dừng đọc
                          </button>
                        ) : (
                          <button
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 focus:outline-none text-xs"
                            title="Đọc nội dung trả lời"
                            onClick={() => speakWithViettelTTS(mainMessage)}
                            type="button"
                          >
                            <FaVolumeUp className="inline-block mr-1" /> Nghe trả lời
                          </button>
                        )}
                        {/* Audio được xử lý bởi Viettel AI TTS */}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 px-2 ${
                      item.sender === 'me' ? 'text-right' : ''
                    }`}
                  >
                    {item.time}
                  </div>
                  {hasUsageLimit && (
                    <div
                      className={`text-xs text-gray-400 mt-1 px-2 ${
                        item.sender === 'me' ? 'text-right' : ''
                      }`}
                    >
                      <span className="opacity-70 italic">
                        {usageLimitText}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <FaBalanceScale className="text-white text-sm" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="flex gap-3 items-center bg-white rounded-2xl p-2 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="relative group">
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1
      ${
        isListening
          ? 'bg-red-500 text-white shadow-lg scale-105 animate-pulse'
          : isVoiceChatMode
          ? 'bg-green-500 text-white shadow-lg scale-105'
          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
      }
      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}`}
                onClick={handleVoiceClick}
                type="button"
                aria-label={
                  isListening 
                    ? 'Dừng ghi âm' 
                    : isVoiceChatMode 
                    ? 'Voice Chat đang xử lý...' 
                    : 'Ghi âm giọng nói'
                }
                disabled={isLoading}
                title={
                  isListening 
                    ? 'Nhấn để dừng ghi âm' 
                    : isVoiceChatMode 
                    ? 'Voice Chat: Đang gửi và phát audio...' 
                    : 'Nhấn để ghi âm (Voice Chat: tự động gửi & phát)'
                }
              >
                {isListening ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : isVoiceChatMode ? (
                  // Icon cho Voice Chat mode (đang xử lý)
                  <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>

              {isListening && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full border-2 border-white animate-ping"></div>
              )}
              
              {isVoiceChatMode && !isListening && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-700 placeholder-gray-500 leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi pháp luật của bạn..."
              rows="1"
              style={{ minHeight: '24px', maxHeight: '120px' }}
              disabled={isLoading}
              autoFocus
            />
            <button
              className={`p-3 rounded-2xl transition-all duration-300 ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              type="button"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperPlane className="text-sm" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
