// Test script for register API
const testData = {
  service: 'user-service',
  path: '/users/register',
  method: 'POST',
  body: {
    email: 'test@example.com',
    full_name: 'Test User',
    password: 'testpass123',
    re_password: 'testpass123'
  }
};

fetch('http://localhost:8000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
