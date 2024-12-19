const request = require('supertest');
const app = require('./app');

describe('TESTS UNITAIRES API ENDPOINTS', () => {

    let roomId;
    let storyId;

    it('should fetch all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'TEST_USER_123',
                password: 'TEST_PASSWORD_123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should fetch a user by username', async () => {
        const response = await request(app).get('/users/TEST_USER_123');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('password');
    });

    // On profite qu'on a un utilisateur pour tester les endpoints de rooms qui ont besoin d'un utiliisateur.
    it('should create a new room', async () => {
        const response = await request(app)
            .post('/rooms')
            .send({
                name: 'New Room',
                mode: 1,
                password: 'password_bidon',
                owner: 'TEST_USER_123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should fetch all rooms', async () => {
        const response = await request(app).get('/rooms');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // On profite du test d'affichage de toutes les rooms pour récupérer celle qu'on vient de créer.
        for (var room of response.body){
            if (room.owner == "TEST_USER_123"){
                roomId = room.id
                break;
            }
        }
    });

    it('should fetch a room by id', async () => {
        const response = await request(app).get('/rooms/'+roomId);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('mode');
        expect(response.body).toHaveProperty('password');
        expect(response.body).toHaveProperty('owner');
    });

    it('should update an existing room', async () => {
        const response = await request(app)
            .put('/rooms/1')
            .send({
                name: 'Nouveau nom',
                mode: 2,
                password: 'Nouveau mot de passe',
            });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should create a new story', async () => {
        const response = await request(app)
            .post('/stories')
            .send({
                name: 'New Story',
                description: 'Jpp de ces tests',
                roomId: roomId // qu'on vient de récupérer !
            });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should fetch all stories', async () => {
        const response = await request(app).get('/stories');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // On profite du test d'affichage de toutes les stories pour récupérer celle qu'on vient de créer.
        for (var story of response.body){
            if (story.roomId == roomId){
                storyId = story.id
                break;
            }
        }
    });

    it('should fetch a story by id', async () => {
        const response = await request(app).get('/stories/'+storyId);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
    });

    it('should update an existing story', async () => {
        const response = await request(app)
            .put('/stories/'+storyId)
            .send({
                name: 'Nouveau nom',
                description: 'descripton v2',
                value: 150,
            });
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should delete a story by id', async () => {
        const response = await request(app).delete('/stories/'+storyId);
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should return 418 when deleting a non-existing story', async () => {
        const response = await request(app).delete('/stories/'+storyId);
        expect(response.status).toBe(418);
        expect(response.body).toBe(false);
    });

    it('should return 418 when updating a non-existing story', async () => {
        const response = await request(app)
            .put('/stories/'+storyId)
            .send({
                name: 'zaezaeae',
                description: 'fgjlhdfg',
                value: 564,
                roomId: 1
            });
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Invalid story.');
    });

    it('should return 418 when story is not found', async () => {
        const response = await request(app).get('/stories/'+storyId);
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Story not found.');
    });

    it('should delete a room by id', async () => {
        const response = await request(app).delete('/rooms/'+roomId);
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should return 418 when deleting a non-existing room', async () => {
        const response = await request(app).delete('/rooms/'+roomId);
        expect(response.status).toBe(418);
        expect(response.body).toBe(false);
    });

    it('should return 418 when room is not found', async () => {
        const response = await request(app).get('/rooms/'+roomId);
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Room not found.');
    });

    it('should return 418 when updating a non-existing room', async () => {
        const response = await request(app)
            .put('/rooms/'+roomId)
            .send({
                name: 'sdlkfj',
                mode: 1,
                password: 'au secours',
                owner: 'TEST_USER_123'
            });
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Invalid room.');
    });

    it('should return 418 when creating a story with invalid roomId', async () => {
        const response = await request(app)
            .post('/stories')
            .send({
                name: 'AHAHAHAHAHAHAHA',
                description: 'pitie marche',
                roomId: roomId
            });
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Invalid roomId.');
    });

    it('should delete a user', async () => {
        const response = await request(app).delete('/users/TEST_USER_123');
        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should return 418 when user is not found', async () => {
        const response = await request(app).get('/users/TEST_USER_123');
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'User not found.');
    });

    it('should return 418 when missing parameters on user creation', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'newuser'
            });
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Missing parameters.');
    });

    it('should return 418 when deleting a non-existing user', async () => {
        const response = await request(app).delete('/users/TEST_USER_123');
        expect(response.status).toBe(418);
        expect(response.body).toBe(false);
    });

    it('should return 418 when creating a room with invalid owner', async () => {
        const response = await request(app)
            .post('/rooms')
            .send({
                name: 'ALLEZ',
                mode: 1,
                password: 'DERNIERE ETAPE',
                owner: 'TEST_USER_123'
            });
        expect(response.status).toBe(418);
        expect(response.body).toHaveProperty('err', 'Invalid owner.');
    });
});