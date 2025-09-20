const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

const GRAPHQL_URL = '/graphql';
const BASE_URL = process.env.BASE_URL_GRAPHQL || 'http://localhost:4000';

describe('GraphQL User Mutations', () => {
		it('should return error when registering with a repeated email', async () => {
			// First registration should succeed
				await request(BASE_URL)
					.post(GRAPHQL_URL)
					.send({
						query: `mutation { register(name: \"Test User\", email: \"repeated@email.com\", password: \"password123\") { name email } }`
					});
				// Second registration with same email should fail
				const res = await request(BASE_URL)
					.post(GRAPHQL_URL)
					.send({
						query: `mutation { register(name: \"Test User\", email: \"repeated@email.com\", password: \"password123\") { name email } }`
					});
			expect(res.body.errors).to.be.an('array');
			console.log('GraphQL register repeated email errors:', res.body.errors);
			const hasRepeatedEmailError = res.body.errors.some(e => e.message === 'Email já cadastrado');
			expect(hasRepeatedEmailError).to.be.true;
		});

	it('should return error when login fails with invalid credentials', async () => {
		const res = await request(BASE_URL)
			.post(GRAPHQL_URL)
			.send({
				query: `mutation { login(email: "notfound@email.com", password: "wrongpassword") { token } }`
			});
		expect(res.body.errors).to.be.an('array');
		expect(res.body.errors[0].message).to.equal('Credenciais inválidas');
	});

	it('should return error when checkout is called with invalid token', async () => {
		const res = await request(BASE_URL)
			.post(GRAPHQL_URL)
			.set('Authorization', 'Bearer invalidtoken')
			.send({
				query: `mutation { checkout(items: [], freight: 0, paymentMethod: "credit", cardData: null) { valorFinal } }`
			});
		expect(res.body.errors).to.be.an('array');
		expect(res.body.errors[0].message).to.equal('Token inválido');
	});
});