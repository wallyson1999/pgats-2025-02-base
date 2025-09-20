const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('UserController', () => {
		describe('POST /api/users/register', () => {
			it('should return 400 when registering with a repeated email', async () => {
				// First registration should succeed
				await request(process.env.BASE_URL_REST)
					.post('/api/users/register')
					.send({
						name: 'Test User',
						email: 'repeated@email.com',
						password: 'password123'
					});
				// Second registration with same email should fail
				const res = await request(process.env.BASE_URL_REST)
					.post('/api/users/register')
					.send({
						name: 'Test User',
						email: 'repeated@email.com',
						password: 'password123'
					});
				expect(res.status).to.equal(400);
				expect(res.body).to.have.property('error', 'Email já cadastrado');
			});
		});

		describe('POST /api/users/login', () => {
			it('should return 401 when login fails with invalid credentials', async () => {
				const res = await request(process.env.BASE_URL_REST)
					.post('/api/users/login')
					.send({
						email: 'notfound@email.com',
						password: 'wrongpassword'
					});
				expect(res.status).to.equal(401);
				expect(res.body).to.have.property('error', 'Credenciais inválidas');
			});
		});
});
