/* eslint-disable no-shadow */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as firebaseHelper from 'firebase-functions-helper';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();
const main = express();

const productCollection = 'product';
const categoryCollection = 'category';
const subscriberCollection = 'subscriber';
const contentCollection = 'content';

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// -- webApi is your functions name, and you will pass main as a parameter
export const webApi = functions.https.onRequest(main);

const cors = require('cors');
 
// -- Automatically allow cross-origin requests
app.use(cors({ origin: true }))

interface product {
    name: String,
    description: String,
    image: String,
    price: number,
    volume: number,
    inStock: number,
    isDeleted: number,
}

interface category {
    name: String,
    description: string,
    isActive: number,
    isDeleted: number,
    products: string
}

interface subscriber {
    name: String,
    email: String,
    phone: String,
    message: String,
    courseId: String,
    isActive: number,
    isDeleted: number,
}

interface content {
    name: String,
    description: String,
    position: number,
    isActive: number,
    isDeleted: number,
}

// -- Course related APIs - start
// -- Add a new product
app.post('/product/add', async (req, res) => {
    try {
        const product: product = {
            name: req.body['name'],
            description: req.body['description'],
            image: req.body['image'],
            price: req.body['price'],
            volume: req.body['volume'],
            inStock: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper
            .createNewDocument(db, productCollection, product);
        res.status(200).send({
            'message': 'Created a new Product',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Product should contains name, description, image, price , volume!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a product
app.patch('/product/edit/:productId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, productCollection, req.params.productId, req.body);
        res.status(200).send({
            'message': 'Product updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Product to update course!',
            'status': 400,
            'error': error,
        });
    }
});

// -- View a product
app.get('/product/:productId', (req, res) => {
    const productId = req.params.productId; 
    db.collection(productCollection).doc(productId).get()
    .then((product: any) => {
        if(!product.exists) throw new Error(JSON.stringify({
            'message': 'Product not found!',
            'status': 200,
        }));
        if (product.data().isDeleted === 0) {
            res.status(200).json({'product': {id: product.id, data: product.data()}});
        } else {
            res.status(200).send({
                'message': 'Product already deleted!',
                'status': 200,
            });
        }
    })
    .catch(error => res.status(500).send({
        'message': 'Product not found!',
        'status': 500,
        'error': error,
    }));
});

// -- View all product
app.get('/product', async (req, res) => {
    try {
        const productQuerySnapshot = await db.collection(productCollection).get();
        const product: any[] = [];
        productQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0) {
                product.push({
                    id: doc.id,
                    data:doc.data(),
                });
            }
        });
        res.status(200).json({'product': product});
    } catch (error) {
        res.status(500).send({
            'message': 'Product list not found!',
            'status': 500,
            'error': error,
        });
    }
});

// -- Delete a product 
app.delete('/product/:productId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.deleteDocument(db, productCollection, req.params.productId);
        res.status(200).send({
            'message': 'Product deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete product!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Delete(soft) a product
app.delete('/product/delete/:productId', async (req, res) => {
    try {
        const body = {
            isDeleted: 1,
        };
        await firebaseHelper.firestoreHelper.updateDocument(db, productCollection, req.params.productId, body);
        res.status(200).send({
            'message': 'Product deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete product!',
            'status': 400,
            'error': error,
        });
    }
});
// -- Product related APIs - end

// -- Category related APIs - start
// -- Add a new enquiry
app.post('/category/add', async (req, res) => {
    try {
        const category: category = {
            name: req.body['name'],
            description: req.body['description'],
            products: JSON.stringify(req.body['products']),
            isActive: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper
            .createNewDocument(db, categoryCollection, category);
        res.status(200).send({
            'message': 'Category Created',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Category should contains name, description, products!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a category
app.patch('/category/edit/:categoryId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, categoryCollection, req.params.categoryId, req.body);
        res.status(200).send(`Category updated.`);
    } catch (error) {
        res.status(400).send(`Unable to update category!!!`);
    }
});

// -- View a category
app.get('/category/:categoryId', (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, categoryCollection, req.params.categoryId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get category: ${error}`));
});

// -- View all enquiries
app.get('/catagories', async (req, res) => {
    try {
        const categoryQuerySnapshot = await db.collection(categoryCollection).get();
        const productQuerySnapshot = await db.collection(productCollection).get();

        const categories: any[] = [];
        categoryQuerySnapshot.forEach((category) => {
            const productsArray = JSON.parse(category.data().products);
            if (category.data().isDeleted === 0 && productsArray.length > 0) {
                const products: any[] = [];
                productQuerySnapshot.forEach((product) => {
                    productsArray.forEach((elem: any) => {
                        if(product.id === elem) {
                            const obj = product.data();
                            obj.id = product.id;
                            products.push(obj);
                        }
                    });
                });
                categories.push({
                    id: category.id,
                    data:category.data(),
                    products,
                });
            }
        });
        res.status(200).json({'category': categories});
    } catch (error) {
        res.status(500).send({
            'message': 'category list not found!',
            'status': 500,
            'error': error,
        });
    }
});

// -- Delete(Hard) a category 
app.delete('/category/:categoryId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.deleteDocument(db, categoryCollection, req.params.categoryId);
        res.status(200).send({
            'message': 'category deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete category!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Delete(soft) a category
app.delete('/category/delete/:categoryId', async (req, res) => {
    try {
        const body = {
            isDeleted: 1,
        };
        await firebaseHelper.firestoreHelper.updateDocument(db, categoryCollection, req.params.categoryId, body);
        res.status(200).send({
            'message': 'category deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete category!',
            'status': 400,
            'error': error,
        });
    }
});
// -- category related APIs - end

// -- Subscriber related APIs - start
// -- Add a new subscriber
app.post('/subscriber/add', async (req, res) => {
    try {
        const subscriber: subscriber = {
            name: req.body['name'],
            email: req.body['email'],
            phone: req.body['phone'],
            message: req.body['message'],
            courseId: req.body['courseId'],
            isActive: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper
            .createNewDocument(db, subscriberCollection, subscriber);
        res.status(200).send({
            'message': 'Created a new subscriber',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Subscriber should contains name, email, phone, message, course!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a subscriber
app.patch('/subscriber/edit/:subscriberId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, subscriberCollection, req.params.subscriberId, req.body);
        res.status(200).send({
            'message': 'Subscriber updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update subscriber!',
            'status': 400,
            'error': error,
        });
    }
});

// -- View a subscriber
app.get('/subscriber/:subscriberId', (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, subscriberCollection, req.params.subscriberId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get subscriber: ${error}`));
});

// -- View all subscribers
app.get('/subscribers', async (req, res) => {
    try {
        const subscriberQuerySnapshot = await db.collection(subscriberCollection).get();
        const courseQuerySnapshot = await db.collection(productCollection).get();

        const subscribers: any[] = [];
        subscriberQuerySnapshot.forEach((subscriber) => {
            if (subscriber.data().isDeleted === 0) {
                let courseDetails: any;
                courseQuerySnapshot.forEach((course) => {
                    if(course.id === subscriber.data().courseId) {
                        courseDetails = course.data();
                    }
                });
                subscribers.push({
                    id: subscriber.id,
                    data:subscriber.data(),
                    courseDetails,
                });
            }
        });
        res.status(200).json({'subscribers': subscribers});
    } catch (error) {
        res.status(500).send({
            'message': 'Subscriber list not found!',
            'status': 500,
            'error': error,
        });
    }
});

// -- Delete(Hard) a subscriber 
app.delete('/subscriber/:subscriberId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.deleteDocument(db, subscriberCollection, req.params.subscriberId);
        res.status(200).send({
            'message': 'Subscriber deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete subscriber!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Delete(soft) a subscriber
app.delete('/subscriber/delete/:subscriberId', async (req, res) => {
    try {
        const body = {
            isDeleted: 1,
        };
        await firebaseHelper.firestoreHelper.updateDocument(db, subscriberCollection, req.params.subscriberId, body);
        res.status(200).send({
            'message': 'Subscriber deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete subscriber!',
            'status': 400,
            'error': error,
        });
    }
});
// -- Subscriber related APIs - end

// -- Content related APIs - start
// -- Add a new content
app.post('/content/add', async (req, res) => {
    try {
        const content: content = {
            name: req.body['name'],
            description: req.body['description'],
            position: req.body['position'],
            isActive: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper.createNewDocument(db, contentCollection, content);
        res.status(200).send({
            'message': 'Created a new content',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Content should contains name, description, short name!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a content
app.patch('/content/edit/:contentId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, contentCollection, req.params.contentId, req.body);
        res.status(200).send({
            'message': 'Content updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update content!',
            'status': 400,
            'error': error,
        });
    }
});

// -- View a content
app.get('/content/:contentId', (req, res) => {
    const contentId = req.params.contentId; 
    db.collection(contentCollection).doc(contentId).get()
    .then((content: any) => {
        if(!content.exists) throw new Error(JSON.stringify({
            'message': 'Content not found!',
            'status': 200,
        }));
        if (content.data().isDeleted === 0) {
            res.status(200).json({'content': {id: content.id, data: content.data()}});
        } else {
            res.status(200).send({
                'message': 'Content already deleted!',
                'status': 200,
            });
        }
    })
    .catch(error => res.status(500).send({
        'message': 'Content not found!',
        'status': 500,
        'error': error,
    }));
});

// -- View all contents
app.get('/contents', async (req, res) => {
    try {
        const contentQuerySnapshot = await db.collection(contentCollection).get();
        const content: any[] = [];
        contentQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0) {
                content.push({
                    id: doc.id,
                    data:doc.data(),
                });
            }
        });
        res.status(200).json({'content': content});
    } catch (error) {
        res.status(500).send({
            'message': 'Content list not found!',
            'status': 500,
            'error': error,
        });
    }
});
// -- Content related APIs - end

