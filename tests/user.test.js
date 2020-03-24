const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setUpDatabase } = require('./fixtures/db');

beforeEach(setUpDatabase)

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Nasrullah',
        email: 'mohammadnasrullah168@gmail.com',
        password: 'Red1234!'
    }).expect(201)

    //Assert to change database
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Nasrullah',
            email: 'mohammadnasrullah168@gmail.com',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('Red1234!')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login invalid users', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password + 5
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('should fail for not authorized user', async () => {
    await request(app)
            .get('/users/me')
            .send()
            .set('Authorization', `Bearer ${userOne.tokens[0].token + 12532}`)
            .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('should not delete unauthenticated user', async () => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)

})

test('should upload avatar', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Noorul'
            })
            .expect(200)

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Noorul')
})

test('should not update invalid field', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                height: 10
            })
            .expect(400)  
})
