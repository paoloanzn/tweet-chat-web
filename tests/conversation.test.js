import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestPrerequisites } from './setup';

describe('Conversation Endpoints', () => {
  let authToken;
  let personaId;
  let conversationId;
  
  beforeAll(async () => {
    await setupTestPrerequisites();
    
    // Create and login a test user to get auth token
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    // Sign up
    await fetch('http://localhost:3000/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    // Sign in
    const loginResponse = await fetch('http://localhost:3000/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    
    const session = await loginResponse.json();
    authToken = session.access_token;

    // Create a test persona to use for conversation tests
    const personaResponse = await fetch('http://localhost:3000/persona/add-new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        twitterHandle: 'testconversations'
      })
    });
    
    const personaData = await personaResponse.json();
    personaId = personaData.data[0]['persona_id'];
  });

  describe('POST /conversation/add-new', () => {
    it('should create a new conversation', async () => {
      const conversationData = {
        title: 'Test Conversation',
        messages: []
      };

      const response = await fetch('http://localhost:3000/conversation/add-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          personaId,
          conversationData
        })
      });
      
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data[0]).toHaveProperty('id');
      
      // Save conversation ID for later tests
      conversationId = data.data[0]['id'];
    });

    it('should fail when missing required fields', async () => {
      const response = await fetch('http://localhost:3000/conversation/add-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          // Missing personaId and conversationData
        })
      });
      
      const data = await response.json();
      expect(response.status).toBe(400);
      expect(data.status).toBe('error');
    });
  });

  describe('GET /conversation/list/:personaId', () => {
    it('should list conversations for a persona', async () => {
      const response = await fetch(`http://localhost:3000/conversation/list/${personaId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0); // Should have at least our test conversation
    });

    it('should handle invalid persona ID', async () => {
      const response = await fetch(`http://localhost:3000/conversation/list/invalid-id`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      expect(response.status).toBe(500); // Should return 500 for invalid UUID
    });
  });

  describe('PUT /conversation/update/:conversationId', () => {
    it('should update an existing conversation', async () => {
      const updatedConversationData = {
        title: 'Updated Test Conversation',
        messages: [
          {
            role: 'user',
            content: 'Hello!'
          }
        ]
      };

      const response = await fetch(`http://localhost:3000/conversation/update/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          conversationData: updatedConversationData
        })
      });
      
      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
    });

    it('should fail when updating with invalid data', async () => {
      const response = await fetch(`http://localhost:3000/conversation/update/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          // Missing conversationData
        })
      });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /conversation/:conversationId', () => {
    it('should delete an existing conversation', async () => {
      // First create a new conversation to delete
      const createResponse = await fetch('http://localhost:3000/conversation/add-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          personaId,
          conversationData: {
            title: 'Conversation to Delete',
            messages: []
          }
        })
      });
      
      const createData = await createResponse.json();
      const tempConversationId = createData.data[0]['id'];

      // Then delete it
      const deleteResponse = await fetch(`http://localhost:3000/conversation/${tempConversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const deleteData = await deleteResponse.json();
      expect(deleteResponse.status).toBe(200);
      expect(deleteData.status).toBe('success');
    });

    it('should handle deleting non-existent conversation', async () => {
      const response = await fetch(`http://localhost:3000/conversation/non-existent-id`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      expect(response.status).toBe(500); // Should return 500 for invalid UUID
    });
  });
}); 