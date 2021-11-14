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
const brandCollection = 'brand';
const userCollection = 'user';
const orderCollection = 'order';
const addressCollection = 'address';

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// -- webApi is your functions name, and you will pass main as a parameter
export const webApi2 = functions.https.onRequest(main);

const cors = require('cors');
 
// -- Automatically allow cross-origin requests
app.use(cors({ origin: true }))

interface product {
    name: String,
    description: String,
    image: String,
    price: number,  
    xprice: number,
    volume: number,
    inStock: number,
    off: number,
    isDeleted: number,
    tag: String | null,
    category: [], 
    brand: [], 
}

interface category {
    name: String,
    description: string,
    image: string,
    isActive: number,
    isDeleted: number,
}

interface brand {
    name: String,
    description: string,
    image: string,
    isActive: number,
    isDeleted: number,
}

interface user {
    name: String,
    email: String,
    phone: String,
    password: string,
    image: string,
    isActive: number,
    isDeleted: number,
}

interface order {
    userid: string,
    items: [],
    totalprice: string,
    status: string,
    daddress: string,
    isActive: number,
    isDeleted: number,
    orderno: number,
    dphone: string,
    date: Date
}

interface address {
    userid: string,
    address: string,
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
            xprice: req.body['xprice'],
            off: req.body['off'],  
            tag: req.body['tag'],
            volume: req.body['volume'],
            category: req.body['category'],
            brand: req.body['brand'],
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
app.get('/product/:productId', async (req, res) => {
    const productId = req.params.productId; 
    const categoryQuerySnapshot = await db.collection(categoryCollection).get();
    const brandQuerySnapshot = await db.collection(brandCollection).get();
    db.collection(productCollection).doc(productId).get()
    .then((product: any) => {
        if(!product.exists) throw new Error(JSON.stringify({
            'message': 'Product not found!',
            'status': 200,
        }));
        if (product.data().isDeleted === 0) {
            const category : any[] = [];
            product.data().category.forEach((element: any) => {
                categoryQuerySnapshot.forEach((cat: any) => {
                    if (element === cat.id) {
                        const obj = {
                            id: cat.id,
                            name: cat.data().name,
                        };
                        category.push(obj);
                    }
                });
            });
            const brand : any[] = [];
            product.data().brand.forEach((element: any) => {
                brandQuerySnapshot.forEach((brnd: any) => {
                    if (element === brnd.id) {
                        const obj = {
                            id: brnd.id,
                            name: brnd.data().name,
                        };
                        brand.push(obj);
                    }
                });
            });
            const productObj = { 
                id: product.id,
                data: product.data(),
                category,
                brand,
            };
            res.status(200).json({'product': productObj});
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
        const categoryQuerySnapshot = await db.collection(categoryCollection).get();
        const brandQuerySnapshot = await db.collection(brandCollection).get();

        const products: any[] = [];
        productQuerySnapshot.forEach((product: any) => {
            const catagoryArray = product.data().category;
            if (product.data().isDeleted === 0 && catagoryArray.length > 0) {
                const category: any[] = [];
                categoryQuerySnapshot.forEach((cat: any) => {
                    catagoryArray.forEach((elem: any) => {
                        if(cat.id === elem) {
                            const obj = {
                                id: cat.id,
                                name: cat.data().name,
                            };
                            category.push(obj);
                        }
                    });
                });
                const brand : any[] = [];
                product.data().brand.forEach((element: any) => {
                    brandQuerySnapshot.forEach((brnd: any) => {
                        if (element === brnd.id) {
                            const obj = {
                                id: brnd.id,
                                name: brnd.data().name,
                            };
                            brand.push(obj);
                        }
                    });
                });
                products.push({
                    id: product.id,
                    data: product.data(),
                    category,
                    brand,
                });
            } 
        });
        res.status(200).json({'products': products});
    } catch (error) {
        res.status(500).send({
            'message': 'products list not found!',
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
// -- Add a new category
app.post('/category/add', async (req, res) => {
    try {
        const category: category = {
            name: req.body['name'],
            description: req.body['description'],
            image: req.body['image'],
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
        res.status(200).send({
            'message': 'Category updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update category!!!',
            'status': 400,
        });
    }
});

// -- View a category
app.get('/category/:categoryId', async (req, res) => {
        const categoryId = req.params.categoryId; 
        const productQuerySnapshot = await db.collection(productCollection).get();
        db.collection(categoryCollection).doc(categoryId).get()
        .then((category: any) => {
            if(!category.exists) throw new Error(JSON.stringify({
                'message': 'Product not found!',
                'status': 200,
            }));
            if (category.data().isDeleted === 0) {
                const products : any[] = [];
                productQuerySnapshot.forEach((product: any) => {
                    if(product.data().category && product.data().category.length > 0 && product.data().category.indexOf(categoryId) !== -1) {
                        const obj = product.data();
                        obj.id = product.id;
                        products.push(obj);
                    }
                });
                const categoryObj = { 
                    id: category.id,
                    data: category.data(),
                    products,
                };
                res.status(200).json({'category': categoryObj});
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

// -- View all category
app.get('/catagories', async (req, res) => {
    try {
        const categoryQuerySnapshot = await db.collection(categoryCollection).get();
        const productQuerySnapshot = await db.collection(productCollection).get();

        const categories: any[] = [];
        categoryQuerySnapshot.forEach((category: any) => {
            if (category.data().isDeleted === 0) {
                const products: any[] = [];
                productQuerySnapshot.forEach((product: any) => {
                    if(product.data().category && product.data().category.length > 0 && product.data().category.indexOf(category.id) !== -1) {
                        const obj = product.data();
                        obj.id = product.id;
                        products.push(obj);
                    }
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

// -- Brand related APIs - start
// -- Add a new brand
app.post('/brand/add', async (req, res) => {
    try {
        const brand: brand = {
            name: req.body['name'],
            description: req.body['description'],
            image: req.body['image'],
            isActive: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper
            .createNewDocument(db, brandCollection, brand);
        res.status(200).send({
            'message': 'Brand Created',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Brand should contains name, description, products!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a brand
app.patch('/brand/edit/:brandId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, brandCollection, req.params.brandId, req.body);
        res.status(200).send({
            'message': 'Brand updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update brand!!!',
            'status': 400,
        });
    }
});

// -- View a brand 
app.get('/brand/:brandId', async (req, res) => {
        const brandId = req.params.brandId; 
        // const productQuerySnapshot = await db.collection(productCollection).get();
        db.collection(brandCollection).doc(brandId).get()
        .then((brand: any) => {
            if(!brand.exists) throw new Error(JSON.stringify({
                'message': 'Brand not found!',
                'status': 200,
            }));
            if (brand.data().isDeleted === 0) {
                // const products : any[] = [];
                // productQuerySnapshot.forEach((product: any) => {
                //     if(product.data().brand && product.data().brand.length > 0 && product.data().brand.indexOf(brandId) !== -1) {
                //         const obj = product.data();
                //         obj.id = product.id;
                //         products.push(obj);
                //     }
                // });
                const brandObj = { 
                    id: brand.id,
                    data: brand.data(),
                    // products,
                };
                res.status(200).json({'brand': brandObj});
            } else {
                res.status(200).send({
                    'message': 'Brand already deleted!',
                    'status': 200,
                });
            }
        })
        .catch(error => res.status(500).send({
            'message': 'Brand not found!',
            'status': 500,
            'error': error,
        }));    
});

// -- View all brand
app.get('/brands', async (req, res) => {
    try {
        console.log("here");
        const brandQuerySnapshot = await db.collection(brandCollection).get();
        // const productQuerySnapshot = await db.collection(productCollection).get();

        const brands: any[] = [];
        brandQuerySnapshot.forEach((brand: any) => {
            if (brand.data().isDeleted === 0) {
                // const products: any[] = [];
                // productQuerySnapshot.forEach((product: any) => {
                //     if(product.data().brand && product.data().brand.length > 0 && product.data().brand.indexOf(brand.id) !== -1) {
                //         const obj = product.data();
                //         obj.id = product.id;
                //         products.push(obj);
                //     }
                // });
                brands.push({
                    id: brand.id,
                    data:brand.data(),
                    // products,
                });
            } 
        });
        res.status(200).json({'brand': brands});
    } catch (error) {
        res.status(500).send({
            'message': 'Brand list not found!',
            'status': 500,
            'error': error,
        });
    }


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

// -- Delete(Hard) a brand 
app.delete('/brand/:brandId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.deleteDocument(db, brandCollection, req.params.brandId);
        res.status(200).send({
            'message': 'Brand deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete brand!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Delete(soft) a brand
app.delete('/brand/delete/:brandId', async (req, res) => {
    try {
        const body = {
            isDeleted: 1,
        };
        await firebaseHelper.firestoreHelper.updateDocument(db, brandCollection, req.params.brandId, body);
        res.status(200).send({
            'message': 'Brand deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete brand!',
            'status': 400,
            'error': error,
        });
    }
});
// -- brand related APIs - end

// -- User related APIs - start
// -- Add a new user
app.post('/user/add', async (req, res) => {
    try {
        const user: user = {
            name: req.body['name'],
            email: req.body['email'],
            phone: req.body['phone'],
            password: req.body['password'],
            image: req.body['image'],
            isActive: 1,
            isDeleted: 0,
        }

        const userQuerySnapshot = await db.collection(userCollection).where('email' , '==', req.body['email']).get();

        if (!userQuerySnapshot.empty) {
            res.status(400).send({
                'message': 'User Already Created With this email id',
                'status': 400,
            });
        } else {
            const newDoc = await firebaseHelper.firestoreHelper
                .createNewDocument(db, userCollection, user);
            res.status(200).send({
                'message': 'User Successfully Registered!',
                'id': newDoc.id,
                'status': 200,
            });
        }
    } catch (error) {
        res.status(400).send({
            'message': 'user should contains name, email, phone , password!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a user
app.patch('/user/edit/:userId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, userCollection, req.params.userId, req.body);
        res.status(200).send({
            'message': 'user updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update user!',
            'status': 400,
            'error': error,
        });
    }
});

// -- View a user
app.get('/user/:userId', (req, res) => {
    firebaseHelper.firestoreHelper
        .getDocument(db, userCollection, req.params.userId)
        .then((doc: any) => res.status(200).send(doc))
        .catch((error: any) => res.status(400).send(`Cannot get user: ${error}`));
});

// -- View all users
app.get('/users', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection(userCollection).get();
        const users: any[] = [];
        userQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0) {
                users.push({
                    id: doc.id,
                    data:doc.data(),
                });
            }
        });
        res.status(200).json({'users': users});
    } catch (error) {
        res.status(500).send({
            'message': 'Users list not found!',
            'status': 500,
            'error': error,
        });
    }
});

// -- Delete(Hard) a user 
app.delete('/user/:userId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.deleteDocument(db, userCollection, req.params.userId);
        res.status(200).send({
            'message': 'user deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete user!',
            'status': 400,
            'error': error,
        });
    }
});

// -- Delete(soft) a user
app.delete('/user/delete/:userId', async (req, res) => {
    try {
        const body = {
            isDeleted: 1,
        };
        await firebaseHelper.firestoreHelper.updateDocument(db, userCollection, req.params.userId, body);
        res.status(200).send({
            'message': 'user deleted',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to delete user!',
            'status': 400,
            'error': error,
        });
    }
});
// -- user related APIs - end

// -- Login Api -- //
app.post('/login', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection(userCollection).where('email' , '==' , req.body['email'].toLowerCase()).get();
        if(!userQuerySnapshot.empty) {
            const user = userQuerySnapshot.docs[0].data();
            user.id = userQuerySnapshot.docs[0].id;
            if (user.password === req.body['password']) {
                res.status(200).send({
                    'message': 'User Logged In',
                    'status': 200,
                    'data': user,
                });
            } else {
                res.status(401).send({
                    'message': 'Wrong Password!',
                    'status': 401,
                });
            }
        } else {
            res.status(401).send({
                'message': 'No User Found Please Register!',
                'status': 401,
            });
        }

    } catch (error) {
        res.status(400).send({
            'message': 'Enter Both Fields!',
            'status': 400,
            'error': error,
        });
    }
});
// -- Login Api -- //

// -- Order related APIs - start
// -- Add a new order with pending
app.post('/order/add', async (req, res) => {
    try {
        const order: order = {
            userid: req.body['userid'],
            items: req.body['items'],
            totalprice: req.body['totalprice'],
            status: req.body['status'],
            daddress: req.body['daddress'],
            dphone: req.body['dphone'],
            orderno: Math.floor(Math.random() * 100000000),
            date: new Date(),
            isActive: 1,
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper.createNewDocument(db, orderCollection, order);
        res.status(200).send({
            'message': 'Created a new order',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'order should contains userid , items , totalprice !',
            'status': 400,
            'error': error,
        });
    }
});


app.post('/confirmorder', async (req, res) => {
    try {
        const order: order = {
            userid: req.body['userid'],
            items: req.body['items'],
            totalprice: req.body['totalprice'],
            status: req.body['status'],
            daddress: req.body['daddress'],
            dphone: req.body['dphone'],
            orderno: Math.floor(Math.random() * 100000000),
            isActive: 1,
            date: new Date(),
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper.createNewDocument(db, orderCollection, order);
        res.status(200).send({
            'message': 'Created a new order',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'order should contains userid , items , totalprice !',
            'status': 400,
            'error': error,
        });
    }
});

// -- Update a order
app.patch('/order/edit/:orderId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, orderCollection, req.params.orderId, req.body);
        res.status(200).send({
            'message': 'order updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update order!',
            'status': 400,
            'error': error,
        });
    }
});

app.get('/order/:userID', async (req, res) => {
    try {
        const orderQuerySnapshot = await db.collection(orderCollection).get();
        const productQuerySnapshot = await db.collection(productCollection).get();
        const userData = await db.collection(userCollection).get();
        
        const orders: any[] = [];
        let userObj = {};
        orderQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0 && doc.data().userid === req.params.userID) {
                const items: any[] = [];
                doc.data().items.forEach((element: any) => {
                    productQuerySnapshot.forEach ((product: any) => {
                        if (product.id === element) {
                            items.push(product.data());
                        }
                    });
                });
                userData.forEach((docs) => {
                    if (docs.id === doc.data().userid) {
                        userObj = docs.data()
                    }
                });
                doc.data().items = items;
                orders.push({
                    id: doc.id,
                    data:doc.data(),
                    items: items,
                    user: userObj,
                });
            }
        });
        res.status(200).json({'orders': orders});
    } catch (error) {
        res.status(500).send({
            'message': 'Order list not found!',
            'status': 500,
            'error': error,
        });
    }
});

app.get('/pendingorders', async (req, res) => {
    try {
        const orderQuerySnapshot = await db.collection(orderCollection).get();
        const productQuerySnapshot = await db.collection(productCollection).get();
        const userData = await db.collection(userCollection).get();
        
        const orders: any[] = [];
        let userObj = {};
        orderQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0 && doc.data().status === 'Pending') {
                const items: any[] = [];
                doc.data().items.forEach((element: any) => {
                    productQuerySnapshot.forEach ((product: any) => {
                        if (product.id === element) {
                            items.push(product.data());
                        }
                    });
                });
                userData.forEach((docs) => {
                    if (docs.id === doc.data().userid) {
                        userObj = docs.data()
                    }
                });
                doc.data().items = items;
                orders.push({
                    id: doc.id,
                    data:doc.data(),
                    items: items,
                    user: userObj,
                });
            }
        });
        res.status(200).json({'orders': orders});
    } catch (error) {
        res.status(500).send({
            'message': 'Order list not found!',
            'status': 500,
            'error': error,
        });
    }
});

app.get('/confirmorders', async (req, res) => {
    try {
        const orderQuerySnapshot = await db.collection(orderCollection).get();
        const orders: any[] = [];
        orderQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0 && doc.data().status === 'Confirm') {
                orders.push({
                    id: doc.id,
                    data:doc.data(),
                });
            }
        });
        res.status(200).json({'orders': orders});
    } catch (error) {
        res.status(500).send({
            'message': 'Orders list not found!',
            'status': 500,
            'error': error,
        });
    }
});

// -- View a order
app.get('/order/:orderId', (req, res) => {
    const orderId = req.params.orderId; 
    db.collection(orderCollection).doc(orderId).get()
    .then((order: any) => {
        if(!order.exists) throw new Error(JSON.stringify({
            'message': 'order not found!',
            'status': 200,
        }));
        if (order.data().isDeleted === 0) {
            res.status(200).json({'order': {id: order.id, data: order.data()}});
        } else {
            res.status(200).send({
                'message': 'order already deleted!',
                'status': 200,
            });
        }
    })
    .catch(error => res.status(500).send({
        'message': 'order not found!',
        'status': 500,
        'error': error,
    }));
});
// -- Order related APIs - end

// -- Address rel api starts
app.post('/address/add', async (req, res) => {
    try {
        const address: address = {
            userid: req.body['userid'],
            address: req.body['address'],
            isDeleted: 0,
        }
        const newDoc = await firebaseHelper.firestoreHelper
            .createNewDocument(db, addressCollection, address);
        res.status(200).send({
            'message': 'Address Saved',
            'id': newDoc.id,
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Address can not blank!',
            'status': 400,
            'error': error,
        });
    }
});

app.patch('/address/edit/:addressId', async (req, res) => {
    try {
        await firebaseHelper.firestoreHelper.updateDocument(db, addressCollection, req.params.addressId, req.body);
        res.status(200).send({
            'message': 'Address updated',
            'status': 200,
        });
    } catch (error) {
        res.status(400).send({
            'message': 'Unable to update address!',
            'status': 400,
            'error': error,
        });
    }
});

// Get address by UserId
app.get('/address/:userID', async (req, res) => {
    try {
        const addressQuerySnapshot = await db.collection(addressCollection).get();
        const address: any[] = [];
        addressQuerySnapshot.forEach((doc) => {
            if (doc.data().isDeleted === 0 && doc.data().userid === req.params.userID) {
                address.push({
                    id: doc.id,
                    data:doc.data(),
                });
            }
        });
        res.status(200).json({'address': address});
    } catch (error) {
        res.status(500).send({
            'message': 'address list not found!',
            'status': 500,
            'error': error,
        });
    }
});
// -- Address rel api starts
