// Test script for profile API endpoint
// Usage: node test-profile.js

// Test 1: Get profile without token (should fail with 401)
console.log('Test 1: Get profile without authentication token...\n');

fetch('http://localhost:8000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    service: 'user-service',
    path: '/users/me',
    method: 'GET'
  })
})
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Response:', data);
    console.log('\n---\n');
    
    // Test 2: Get profile with valid token
    console.log('Test 2: Login first to get token...\n');
    return fetch('http://localhost:8000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service: 'user-service',
        path: '/users/login',
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'testpass123'
        }
      })
    });
  })
  .then(res => res.json())
  .then(loginData => {
    console.log('Login successful!');
    console.log('User:', loginData.user);
    console.log('Access Token:', loginData.access.substring(0, 50) + '...');
    console.log('\n---\n');
    
    // Test 3: Get profile with valid token
    console.log('Test 3: Get profile with authentication token...\n');
    return fetch('http://localhost:8000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.access}`
      },
      body: JSON.stringify({
        service: 'user-service',
        path: '/users/me',
        method: 'GET'
      })
    });
  })
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(profileData => {
    console.log('Response:', profileData);
    console.log('\n---\n');
    
    // Test 4: Get profile with invalid token
    console.log('Test 4: Get profile with invalid token...\n');
    return fetch('http://localhost:8000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid_token_here'
      },
      body: JSON.stringify({
        service: 'user-service',
        path: '/users/me',
        method: 'GET'
      })
    });
  })
  .then(res => {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Response:', data);
    console.log('\nAll tests completed!');
  })
  .catch(err => console.error('Error:', err));
