// src/pages/Report.jsx

import { useState, useRef, useEffect } from "react";

import Navbar from "../components/Navbar";

import { motion, useAnimation } from "framer-motion";

import { useInView } from "react-intersection-observer";

import Toast from "../components/Toast";

import { getAuth } from "../utils/auth";


// Floating elements background component

const FloatingBackgroundElements = () => {

  return (

    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {[...Array(15)].map((_, i) => (

        <motion.div

          key={i}

          className="absolute text-green-200 opacity-40"

          style={{

            top: `${Math.random() * 100}%`,

            left: `${Math.random() * 100}%`,

            fontSize: `${Math.random() * 30 + 10}px`,

          }}

          animate={{

            y: [0, Math.random() * 40 - 20, 0],

            x: [0, Math.random() * 40 - 20, 0],

            rotate: [0, Math.random() * 360],

          }}

          transition={{

            duration: Math.random() * 10 + 10,

            repeat: Infinity,

            repeatType: "reverse",

            ease: "easeInOut",

          }}

        >

          {["🌿", "🦀", "🦩", "🌊", "🐠"][i % 5]}

        </motion.div>

      ))}

    </div>

  );

};



// Animated upload area component

const AnimatedUploadArea = ({ selectedImage, uploadError, handleRemoveImage, onCapture, isCapturing, cameraError, videoRef, onStartCamera, onStopCamera, onImageChange, fileInputRef, captureMode, onToggleMode }) => {

  const controls = useAnimation();

  const [ref, inView] = useInView({

    threshold: 0.3,

    triggerOnce: true,

  });



  useEffect(() => {

    if (inView) {

      controls.start("visible");

    }

  }, [controls, inView]);



  const containerVariants = {

    hidden: { opacity: 0, x: -50 },

    visible: {

      opacity: 1,

      x: 0,

      transition: {

        duration: 0.6,

        ease: "easeOut",

      },

    },

  };



  const uploadAreaVariants = {

    rest: { scale: 1 },

    hover: { scale: 1.02 },

    tap: { scale: 0.98 }

  };



  return (

    <motion.div

      ref={ref}

      variants={containerVariants}

      initial="hidden"

      animate={controls}

      className="md:w-1/2 w-full"

    >

      <motion.h2 

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5, delay: 0.2 }}

        className="text-xl font-semibold text-green-900 mb-4 tracking-wide"

      >

        {captureMode === 'camera' ? 'Capture Photo Evidence' : 'Upload Photo Evidence'}

      </motion.h2>

      {/* Mode Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => onToggleMode('camera')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            captureMode === 'camera'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          📷 Camera
        </button>
        <button
          type="button"
          onClick={() => onToggleMode('upload')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            captureMode === 'upload'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          📁 Upload
        </button>
      </div>

      

      <motion.div 

        variants={uploadAreaVariants}

        initial="rest"

        className={`border-2 ${uploadError || cameraError ? 'border-red-400' : 'border-green-300'} rounded-2xl bg-green-50 p-6 transition-all duration-200 relative overflow-hidden group`}

      >

        {/* Animated background elements */}

        <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        

        {selectedImage ? (

          <motion.div 

            initial={{ opacity: 0, scale: 0.8 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 0.4 }}

            className="relative"

          >

            <img

              src={selectedImage}

              alt="Captured issue"

              className="rounded-xl shadow-md w-full h-64 object-cover"

            />

            <motion.button

              initial={{ opacity: 0, scale: 0 }}

              animate={{ opacity: 1, scale: 1 }}

              transition={{ delay: 0.2 }}

              type="button"

              onClick={(e) => {

                e.stopPropagation();

                handleRemoveImage();

              }}

              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"

              whileHover={{ scale: 1.1 }}

              whileTap={{ scale: 0.9 }}

            >

              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">

                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />

              </svg>

            </motion.button>

          </motion.div>

        ) : (

          <div className="relative">

            {captureMode === 'camera' && isCapturing ? (

              <motion.div 

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="relative"

              >

                <video

                  ref={videoRef}

                  autoPlay

                  playsInline

                  muted

                  className="rounded-xl shadow-md w-full h-64 object-cover bg-black"

                  style={{ transform: 'scaleX(-1)' }}

                />

                <motion.button

                  initial={{ opacity: 0, scale: 0 }}

                  animate={{ opacity: 1, scale: 1 }}

                  transition={{ delay: 0.2 }}

                  type="button"

                  onClick={onCapture}

                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center"

                  whileHover={{ scale: 1.1 }}

                  whileTap={{ scale: 0.9 }}

                >

                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">

                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>

                    <circle cx="12" cy="12" r="3"/>

                  </svg>

                </motion.button>

              </motion.div>

            ) : captureMode === 'upload' ? (

              <motion.div 

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="flex flex-col items-center justify-center h-48 py-6 cursor-pointer"

                onClick={() => fileInputRef.current?.click()}

              >

                <motion.svg 

                  initial={{ scale: 0, rotate: -180 }}

                  animate={{ scale: 1, rotate: 0 }}

                  transition={{ type: "spring", stiffness: 200, damping: 15 }}

                  xmlns="http://www.w3.org/2000/svg" 

                  className="h-12 w-12 text-green-500 mb-4" 

                  fill="none" 

                  viewBox="0 0 24 24" 

                  stroke="currentColor"

                >

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />

                </motion.svg>

                <p className="text-green-700 text-center mb-2 font-medium tracking-wide">Click to upload an image</p>

                <p className="text-green-600 text-sm text-center tracking-wide">JPG, PNG or GIF (Max 5MB)</p>

              </motion.div>

            ) : (

              <motion.div 

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.5 }}

                className="flex flex-col items-center justify-center h-48 py-6"

              >

                <motion.svg 

                  initial={{ scale: 0, rotate: -180 }}

                  animate={{ scale: 1, rotate: 0 }}

                  transition={{ type: "spring", stiffness: 200, damping: 15 }}

                  xmlns="http://www.w3.org/2000/svg" 

                  className="h-12 w-12 text-green-500 mb-4" 

                  fill="none" 

                  viewBox="0 0 24 24" 

                  stroke="currentColor"

                >

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />

                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />

                </motion.svg>

                <p className="text-green-700 text-center mb-2 font-medium tracking-wide">Camera not started</p>

                <p className="text-green-600 text-sm text-center tracking-wide">Click "Start Camera" to capture a photo</p>

              </motion.div>

            )}

          </div>

        )}

        {/* Hidden file input for upload mode */}
        {captureMode === 'upload' && (
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        )}

      </motion.div>

      

      {(uploadError || cameraError) && (

        <motion.p 

          initial={{ opacity: 0, y: 10 }}

          animate={{ opacity: 1, y: 0 }}

          className="text-red-500 text-sm mt-3 flex items-center"

        >

          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">

            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />

          </svg>

          {uploadError || cameraError}

        </motion.p>

      )}

      {!selectedImage && !isCapturing && captureMode === 'camera' && (

        <motion.button

          initial={{ opacity: 0, y: 10 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 0.3 }}

          type="button"

          onClick={onStartCamera}

          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition-all font-medium flex items-center justify-center gap-2"

          whileHover={{ scale: 1.02 }}

          whileTap={{ scale: 0.98 }}

        >

          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />

          </svg>

          Start Camera

        </motion.button>

      )}

      {isCapturing && captureMode === 'camera' && (

        <motion.button

          initial={{ opacity: 0, y: 10 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 0.3 }}

          type="button"

          onClick={onStopCamera}

          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-md transition-all font-medium flex items-center justify-center gap-2"

          whileHover={{ scale: 1.02 }}

          whileTap={{ scale: 0.98 }}

        >

          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />

          </svg>

          Stop Camera

        </motion.button>

      )}

    </motion.div>

  );

};



// Animated description area component

const AnimatedDescriptionArea = ({ description, setDescription, isSubmitting, handleSubmit }) => {

  const controls = useAnimation();

  const [ref, inView] = useInView({

    threshold: 0.3,

    triggerOnce: true,

  });



  useEffect(() => {

    if (inView) {

      controls.start("visible");

    }

  }, [controls, inView]);



  const containerVariants = {

    hidden: { opacity: 0, x: 50 },

    visible: {

      opacity: 1,

      x: 0,

      transition: {

        duration: 0.6,

        ease: "easeOut",

      },

    },

  };



  const buttonVariants = {

    rest: { scale: 1 },

    hover: { scale: 1.05 },

    tap: { scale: 0.95 }

  };



  return (

    <motion.div

      ref={ref}

      variants={containerVariants}

      initial="hidden"

      animate={controls}

      className="md:w-1/2 w-full"

    >

      <motion.h2 

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.5, delay: 0.3 }}

        className="text-xl font-semibold text-green-900 mb-4 tracking-wide"

      >

        Issue Details

      </motion.h2>

      

      <div className="mb-6">

        <motion.label 

          initial={{ opacity: 0, y: 10 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 0.4 }}

          htmlFor="description" 

          className="block text-green-800 font-medium mb-2 tracking-wide"

        >

          Description *

        </motion.label>

        <motion.textarea

          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5, delay: 0.5 }}

          id="description"

          value={description}

          onChange={(e) => setDescription(e.target.value)}

          placeholder="Please describe the issue in detail. Include location, type of problem, and any other relevant information..."

          className="w-full h-40 p-4 rounded-2xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition-all tracking-wide"

        />

        <motion.p 

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ duration: 0.5, delay: 0.6 }}

          className="text-green-600 text-sm mt-2 tracking-wide"

        >

          {description.length}/500 characters

        </motion.p>

      </div>

      

      <div className="flex flex-col sm:flex-row gap-4">

        <motion.button

          variants={buttonVariants}

          initial="rest"

          whileHover="hover"

          whileTap="tap"

          type="submit"

          disabled={isSubmitting}

          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3.5 rounded-2xl shadow-md transition-all font-medium flex items-center justify-center relative overflow-hidden group tracking-wide"

          onClick={handleSubmit}

        >

          {/* Button shine effect */}

          <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>

          {isSubmitting ? (

            <>

              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">

                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>

              </svg>

              Submitting...

            </>

          ) : (

            "Submit Report"

          )}

        </motion.button>

        

        <motion.button

          variants={buttonVariants}

          initial="rest"

          whileHover="hover"

          whileTap="tap"

          type="button"

          onClick={() => {

            setDescription("");

          }}

          className="bg-white text-green-700 border border-green-300 hover:bg-green-50 px-6 py-3.5 rounded-2xl shadow-sm transition-all font-medium tracking-wide"

        >

          Clear Description

        </motion.button>

      </div>

      

      <motion.p 

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ duration: 0.5, delay: 0.8 }}

        className="text-green-600 text-sm mt-6 tracking-wide"

      >

        * Your report will be reviewed by our conservation team within 24-48 hours.

      </motion.p>

    </motion.div>

  );

};



export default function Report() {

  const [selectedImage, setSelectedImage] = useState(null);

  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadError, setUploadError] = useState("");

  const [mounted, setMounted] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isCapturing, setIsCapturing] = useState(false);

  const [cameraError, setCameraError] = useState("");

  const [captureMode, setCaptureMode] = useState('camera'); // 'camera' or 'upload'

  const [userLocation, setUserLocation] = useState(null); // { lat, lon }

  const [locationError, setLocationError] = useState("");

  const [isFromCamera, setIsFromCamera] = useState(false); // Track if current image is from camera

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const canvasRef = useRef(null);

  const fileInputRef = useRef(null);



  const getCurrentLocation = () => {

    try {

      if (typeof navigator !== 'undefined' && navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

          (position) => {

            setUserLocation({

              lat: position.coords.latitude,

              lon: position.coords.longitude

            });

            setLocationError("");

          },

          (error) => {

            console.error("Error getting location:", error);

            setLocationError("Location access denied or unavailable. Vegetation analysis may not be available.");

            setUserLocation(null);

          },

          {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

          }

        );

      } else {

        setLocationError("Geolocation not supported by your browser.");

      }

    } catch (error) {

      console.error("Error in getCurrentLocation:", error);

      setLocationError("Failed to get location.");

    }

  };


  useEffect(() => {

    setMounted(true);

    // Request user's location when component mounts (only if geolocation is available)
    try {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Error initializing geolocation:", error);
      setLocationError("Location services not available.");
    }

    // Cleanup camera stream on unmount

    return () => {

      if (streamRef.current) {

        streamRef.current.getTracks().forEach(track => track.stop());

      }

    };

  }, []);


  // Effect to ensure video plays when stream is attached and video element is ready

  useEffect(() => {

    if (isCapturing && videoRef.current && streamRef.current) {

      const video = videoRef.current;

      // Check if stream is already attached

      if (video.srcObject !== streamRef.current) {

        video.srcObject = streamRef.current;

      }

      // Ensure video is playing

      const playVideo = async () => {

        try {

          await video.play();

          console.log("Video playing via useEffect");

        } catch (err) {

          console.log("Video play attempt in useEffect:", err);

          // Try again after a short delay

          setTimeout(() => {

            video.play().catch(e => console.log("Retry play failed:", e));

          }, 200);

        }

      };

      playVideo();

    }

  }, [isCapturing]);


  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };


  const startCamera = async () => {

    try {

      setCameraError("");

      // Stop any existing stream first

      if (streamRef.current) {

        streamRef.current.getTracks().forEach(track => track.stop());

        streamRef.current = null;

      }

      // Set capturing state first to render the video element

      setIsCapturing(true);

      // Request camera access

      const stream = await navigator.mediaDevices.getUserMedia({

        video: { 

          facingMode: 'environment', // Use back camera on mobile

          width: { ideal: 1280 },

          height: { ideal: 720 }

        }

      });

      

      streamRef.current = stream;

      // Wait for next render cycle so video element is in DOM

      setTimeout(() => {

        if (videoRef.current && streamRef.current) {

          const video = videoRef.current;

          video.srcObject = streamRef.current;

          // Wait for video to be ready and play

          video.onloadedmetadata = async () => {

            try {

              await video.play();

              console.log("Video is playing successfully");

            } catch (err) {

              console.error("Error playing video:", err);

              setCameraError("Unable to start camera video. Please try again.");

              setIsCapturing(false);

            }

          };

          // Also try to play immediately (for some browsers)

          video.play().catch(err => {

            console.log("Initial play attempt failed, waiting for metadata:", err);

            // This is okay, onloadedmetadata will handle it

          });

        } else {

          console.error("Video ref is not available after render");

          setCameraError("Video element not ready. Please try again.");

          setIsCapturing(false);

          if (streamRef.current) {

            streamRef.current.getTracks().forEach(track => track.stop());

            streamRef.current = null;

          }

        }

      }, 100);

    } catch (error) {

      console.error("Error accessing camera:", error);

      let errorMessage = "Unable to access camera. ";

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {

        errorMessage += "Please grant camera permissions and try again.";

      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {

        errorMessage += "No camera found on your device.";

      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {

        errorMessage += "Camera is being used by another application.";

      } else {

        errorMessage += "Please ensure camera permissions are granted and no other app is using it.";

      }

      setCameraError(errorMessage);

      setIsCapturing(false);

    }

  };


  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current.getTracks().forEach(track => track.stop());

      streamRef.current = null;

    }

    if (videoRef.current) {

      videoRef.current.srcObject = null;

    }

    setIsCapturing(false);

    setCameraError("");

  };


  const capturePhoto = () => {

    try {

      if (!videoRef.current || !canvasRef.current) {

        setCameraError("Camera not ready. Please try again.");

        return;

      }

      

      const video = videoRef.current;

      const canvas = canvasRef.current;

      const context = canvas.getContext('2d');

      

      // Set canvas dimensions to match video

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      

      // Draw video frame to canvas

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      

      // Convert canvas to blob

      canvas.toBlob((blob) => {

        if (!blob) {

          setCameraError("Failed to capture photo. Please try again.");

          return;

        }

        

        // Validate blob size (5MB limit)

        if (blob.size > 5 * 1024 * 1024) {

          setCameraError("Captured image is too large. Please try again with better lighting.");

          return;

        }

        

        // Create File object from blob

        const file = new File([blob], `captured-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

        

        // Create preview URL

        const imageUrl = URL.createObjectURL(blob);

        

        setSelectedImage(imageUrl);

        setSelectedFile(file);

        setIsFromCamera(true); // Mark this image as from camera

        setUploadError("");

        setCameraError("");

        
        // Stop camera after capture

        stopCamera();

      }, 'image/jpeg', 0.9);

      

    } catch (error) {

      console.error("Error capturing photo:", error);

      setCameraError("Failed to capture photo. Please try again.");

    }

  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;



    // Validate file type and size

    if (!file.type.startsWith('image/')) {

      setUploadError("Please select an image file");

      return;

    }



    if (file.size > 5 * 1024 * 1024) { // 5MB limit

      setUploadError("Image size should be less than 5MB");

      return;

    }



    setUploadError("");

    setIsFromCamera(false); // Mark as uploaded file, not from camera

    setSelectedImage(URL.createObjectURL(file));

    setSelectedFile(file);
  };



  const handleRemoveImage = () => {

    setSelectedImage(null);

    setSelectedFile(null);

    setIsFromCamera(false);

    setUploadError("");


  };


  const toggleMode = (mode) => {

    if (captureMode === 'camera' && isCapturing) {

      stopCamera();

    }

    setCaptureMode(mode);

    setUploadError("");

    setCameraError("");

  };



  const handleSubmit = async (e) => {

    e.preventDefault();



    if (!selectedFile || !description) {

      setUploadError("Please upload a photo and add a description.");

      return;

    }



    setIsSubmitting(true);



    try {

      // Get user auth data
      const auth = getAuth();
      
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("mode", "image");
      formData.append("description", description);
      
      // If image is from camera, send browser coordinates for vegetation analysis
      // If image is uploaded, don't send browser coordinates - only use EXIF from image
      if (isFromCamera && userLocation && userLocation.lat && userLocation.lon) {
        formData.append("latitude", userLocation.lat.toString());
        formData.append("longitude", userLocation.lon.toString());
      }
      
      // Add user_id if user is logged in
      if (auth && auth.user_id) {
        formData.append("user_id", auth.user_id);
      }

  const response = await fetch("http://127.0.0.1:5000/run-pipeline", {
        method: "POST",
        body: formData,
      });



      const result = await response.json();



      if (result.status === "success") {

        // Check for satellite vegetation change and AI analysis
        const satelliteData = result.result?.satellite_vegetation_change;
        const confidence = result.result?.confidence;
        const label = result.result?.label;
        const coordinateSource = result.result?.coordinate_source;
        
        let validationMessage = "";
        
        // Always show AI classification result if available
        if (label) {
          const labelDisplay = label.charAt(0).toUpperCase() + label.slice(1);
          
          if (label.includes("mangrove")) {
            // AI detected mangrove-related issue
            if (satelliteData !== null && satelliteData !== undefined) {
              // Both AI and satellite data available
              if (satelliteData > 5) {
                validationMessage = `🎯 Excellent! Both AI analysis and satellite data confirm significant vegetation change of ${satelliteData.toFixed(1)}% in the last 30 days. Your report has been verified!`;
              } else if (satelliteData > 0 && satelliteData <= 5) {
                validationMessage = `📊 Both AI and satellite analysis show moderate vegetation change of ${satelliteData.toFixed(1)}% in the last 30 days. Valid report!`;
              } else if (satelliteData < 0) {
                validationMessage = `📉 Both AI and satellite analysis show ${Math.abs(satelliteData.toFixed(1))}% vegetation loss in the last 30 days. Valid report!`;
              } else {
                validationMessage = `✅ AI detected: ${labelDisplay}. Satellite analysis shows no significant vegetation change in the last 30 days. Our team will investigate further.`;
              }
            } else {
              // AI detected but no satellite data
              if (coordinateSource === "none") {
                validationMessage = `✅ AI detected: ${labelDisplay}. ⚠️ Could not fetch coordinates from image EXIF data. Satellite analysis unavailable. Our team will investigate further.`;
              } else {
                validationMessage = `✅ AI detected: ${labelDisplay}. Satellite data unavailable for this location. Our team will investigate further.`;
              }
            }
          } else {
            // AI detected non-mangrove classification
            validationMessage = `📝 AI Classification: ${labelDisplay}`;
            if (coordinateSource === "none") {
              validationMessage += `. ⚠️ Could not fetch coordinates from image EXIF data.`;
            }
            if (satelliteData !== null && satelliteData !== undefined) {
              validationMessage += ` Satellite analysis shows ${satelliteData.toFixed(1)}% vegetation change.`;
            }
            validationMessage += ` Our team will review your submission.`;
          }
        } else {
          // No AI classification
          if (coordinateSource === "none") {
            validationMessage = `📝 Report submitted. ⚠️ Could not fetch coordinates from image EXIF data. Our team will review your submission.`;
          } else if (satelliteData !== null && satelliteData !== undefined) {
            validationMessage = `📝 Report submitted. Satellite analysis shows ${satelliteData.toFixed(1)}% vegetation change. Our team will review your submission.`;
          } else {
            validationMessage = `📝 Report submitted successfully! Our team will review your submission.`;
          }
        }
        
        // Add confidence level if available
        if (confidence && confidence > 0.3) {
          validationMessage += ` (AI Confidence: ${Math.round(confidence * 100)}%)`;
        }
        
        // Add coordinate source info for transparency
        if (coordinateSource === "exif") {
          validationMessage += ` [Coordinates from image]`;
        } else if (coordinateSource === "browser_geolocation") {
          validationMessage += ` [Coordinates from browser location]`;
        }
        
        showToast(validationMessage, "success");
        
        // Dispatch event to update stats in Profile page
        window.dispatchEvent(new Event('reportsUpdated'));
        
        // Reset form
        setSelectedImage(null);

        setSelectedFile(null);

        setIsFromCamera(false);

        setDescription("");

      } else {

        showToast(result.message || "There was an error submitting your report.", "error");
      }

    } catch (error) {

      showToast("There was an error submitting your report. Please try again.", "error");
    } finally {

      setIsSubmitting(false);

    }

  };



  if (!mounted) return null;



  return (

    <div className="min-h-screen flex flex-col bg-green-50 relative overflow-hidden">

      {/* Animated background elements */}

      <FloatingBackgroundElements />

      

      <Navbar />



      {/* Hero Section */}

      <motion.header 

        initial={{ opacity: 0, y: -20 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.7 }}

        className="text-center py-12 md:py-20 bg-gradient-to-b from-green-100 to-green-50 relative"

      >

        {/* Animated wave divider */}

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">

          <svg 

            className="relative block w-full h-12 md:h-20" 

            data-name="Layer 1" 

            xmlns="http://www.w3.org/2000/svg" 

            viewBox="0 0 1200 120" 

            preserveAspectRatio="none"

          >

            <path 

              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 

              className="fill-green-50"

            ></path>

          </svg>

        </div>

        

        <div className="container mx-auto px-4 relative z-10">

          <motion.h1 

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.7, delay: 0.2 }}

            className="text-4xl md:text-5xl font-bold text-green-900 mb-4 tracking-wide"

          >

            Report Mangrove Issue

          </motion.h1>

          <motion.p 

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.7, delay: 0.4 }}

            className="text-lg md:text-xl text-green-800 max-w-3xl mx-auto leading-relaxed tracking-wide"

          >

            Help us protect mangroves by reporting issues with photos and detailed descriptions. 

            Your reports help conservation efforts.

          </motion.p>

        </div>

      </motion.header>



      {/* Form Section */}

      <main className="flex-grow container mx-auto py-12 px-4 relative z-10">

        <motion.div 

          initial={{ opacity: 0, y: 50 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.7 }}

          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-200 max-w-5xl mx-auto"

        >

          <form className="flex flex-col md:flex-row gap-10">

            <AnimatedUploadArea

              selectedImage={selectedImage}

              uploadError={uploadError}

              handleRemoveImage={handleRemoveImage}

              onCapture={capturePhoto}

              isCapturing={isCapturing}

              cameraError={cameraError}

              videoRef={videoRef}

              onStartCamera={startCamera}

              onStopCamera={stopCamera}

              onImageChange={handleImageChange}

              fileInputRef={fileInputRef}

              captureMode={captureMode}

              onToggleMode={toggleMode}

            />

            <canvas ref={canvasRef} className="hidden" />

            {/* Location Status Indicator */}
            {locationError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-yellow-600 text-xs flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {locationError}
              </motion.div>
            )}
            {userLocation && !locationError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-green-600 text-xs flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location captured: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
              </motion.div>
            )}



            <AnimatedDescriptionArea

              description={description}

              setDescription={setDescription}

              isSubmitting={isSubmitting}

              handleSubmit={handleSubmit}

            />

          </form>

        </motion.div>

      </main>



      {/* Animated wave divider */}

      <div className="relative w-full overflow-hidden h-20 -mt-5">

        <svg 

          className="relative block w-full h-full" 

          viewBox="0 0 1200 120" 

          preserveAspectRatio="none"

        >

          <path 

            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 

            opacity=".25" 

            className="fill-green-200"

          ></path>

          <path 

            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0Z" 

            opacity=".5" 

            className="fill-green-200"

          ></path>

          <path 

            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 

            className="fill-green-200"

          ></path>

        </svg>

      </div>



      {/* Footer */}

      <footer className="bg-green-900 text-white py-12 px-6 mt-16 relative z-10">

        <div className="container mx-auto text-center text-green-300 tracking-wide">

          <motion.p

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            transition={{ duration: 0.8 }}

            viewport={{ once: true }}

          >

            © {new Date().getFullYear()} Mangrove Watch. All rights reserved.

          </motion.p>

          <motion.p 

            initial={{ opacity: 0 }}

            whileInView={{ opacity: 1 }}

            transition={{ duration: 0.8, delay: 0.2 }}

            viewport={{ once: true }}

            className="mt-2 text-sm"

          >

            Protecting mangrove ecosystems through community reporting

          </motion.p>

        </div>

      </footer>


      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={hideToast}
      />
    </div>

  );

}
