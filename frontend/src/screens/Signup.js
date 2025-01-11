import React, { useState } from 'react'; // Import React and useState hook
import { Link } from 'react-router-dom'; // Import Link component for navigation
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for notifications
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    // Initialize state to hold form data
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", geolocation: "" });

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Send a POST request to the server with the form data
            const response = await fetch("https://eatfit-ecwm.onrender.com/api/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Specify the content type
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    location: credentials.geolocation
                }) // Convert the credentials object to a JSON string
            });

            // Parse the JSON response
            const json = await response.json();
            console.log(json); // Log the response to the console

            // Handle success or failure
            if (json.success) {
                toast.success("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = '/loginuser'; // Redirect to login page after success
                }, 3000);
            } else {
                if (json.errors && Array.isArray(json.errors)) {
                    json.errors.forEach(err => toast.error(err.msg));
                } else {
                    toast.error("Signup failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    // Function to handle changes in the form inputs
    const onChange = (event) => {
        // Update the corresponding state property with the input's value
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    // Function to find the user's live location
    const findLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=YOUR_API_KEY&lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await response.json();
                    if (data.address) {
                        const location = `${data.address.road}, ${data.address.city}, ${data.address.state}, ${data.address.country}`;
                        setCredentials({ ...credentials, geolocation: location });
                    } else {
                        toast.error("Unable to fetch location data");
                    }
                } catch (error) {
                    console.error("Error fetching location data:", error);
                    toast.error("Error fetching location data. Please try again.");
                }
            }, (error) => {
                console.error("Error getting location:", error);
                toast.error("Unable to retrieve your location. Please enable location access.");
            });
        } else {
            toast.error("Geolocation is not supported by this browser");
        }
    };

    // Define inline styles
    const containerStyle = {
        backgroundImage: 'url("https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // Replace with the path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const formStyle = {
        background: '#353935', // Set background color to brown
        color: 'white', // Ensure text is readable on the brown background
        padding: '20px',
        borderRadius: '10px',
        opacity: 0.97,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '500px', // Increase width
        maxWidth: '90%' // Ensure it is responsive on smaller screens
    };

    return (
        <div style={containerStyle}>
            <form style={formStyle} onSubmit={handleSubmit}> {/* Form submission is handled by handleSubmit */}
                <h2 className="text-center mb-4">Signup</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name='name' 
                        value={credentials.name} 
                        onChange={onChange} 
                        id="name" 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name='email' 
                        value={credentials.email} 
                        onChange={onChange} 
                        id="email" 
                        aria-describedby="emailHelp" 
                        required 
                    />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name='password' 
                        value={credentials.password} 
                        onChange={onChange} 
                        id="password" 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="geolocation" className="form-label">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name='geolocation' 
                        value={credentials.geolocation} 
                        onChange={onChange} 
                        id="geolocation" 
                    />
                    <button type="button" className="btn btn-secondary mt-2" onClick={findLocation}>Find My Location</button>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <Link to="/loginuser" className='m-3 btn btn-danger'>Already a user</Link> {/* Link to the login page */}
            </form>
            <ToastContainer />
        </div>
    );
}
