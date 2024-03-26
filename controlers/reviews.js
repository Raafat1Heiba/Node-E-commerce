const Product = require('../models/productModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

// const getProductReviews = async (req, res) => {
//     const {
//         id
//     } = req.params;
//     try {
//         const reviews = await Review.find({
//             product: id
//         }).populate('user').populate('product');
//         res.send(reviews);

//     } catch (error) {
//         return res.status(404).send("Invalid request" + error.message);
//     }
// }

const getProductReviews = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const reviews = await Review.find({
            product: id
        }).populate('user').exec();
        res.send(reviews);

    } catch (error) {
        return res.status(404).send("Invalid request");
    }
}

const addProductReviews = async (req, res) => {
    try {
        const {
            reviewDetails,
           
        } = req.body;
        const user= req.user;
        console.log(user)
        //const email =req.headers["email"];
        // const user= req.user;

        //const user = await User.findOne({email: email});

        const {
            id
        } = req.params;

        if (!user || !reviewDetails) {
            res.status(404).send({
                message: "missed data"
            })
            return
        }

        const product = await Product.findOne({
            _id: id
        });
        if (!product) {
            res.status(422).send("invalid")
            return
        }
        const review = await Review.create({
            reviewDetails: reviewDetails,
            user: user.id,
            product: id
        })
        res.send(review);
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
}
const deleteProductReviews = async (req, res) => {
    try {

        const user= req.user;
        // const {
        //     user
        // } = req.headers;
        console.log(user)

        const {
            id
        } = req.params;

        if (!user) {

            res.status(404).send({
                message: "missed data"
            })
            return
        }

        const review = await Review.findOne({
            _id: id
        }).populate("user");
        if (!review) {
            res.status(422).send("invalid")
            return
        }
        if (review.user.id !== user.id) {
            res.status(422).send("invalid2")
            return
        }
        await review.deleteOne({
            _id: id
        });

        res.send("deleted");
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
}

const editProductReviews = async (req, res) => {
    try {
        //const email =req.headers["email"];
        const {
            reviewDetails,
          
        } = req.body;
        const user= req.user;

        //const user = await User.findOne({email: email});

        const {
            id
        } = req.params;

        if (!user) {

            res.status(404).send({
                message: "missed data"
            })
            return
        }

        const review = await Review.findOne({
            _id: id
        }).populate("user");
        if (!review) {
            res.status(422).send("invalid1")
            return
        }

        if (review.user.id != user.id) {
            res.status(422).send("invalid2")
            return
        }
        const updatedReview = await Review.updateOne({
            _id: id
        }, {
            reviewDetails
        });
        res.send(updatedReview);
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
}

const addProductRating = async (req, res) => {
    try {
        const {
            rating
        } = req.body;
        const {
            id
        } = req.params;


        if (!rating)
            return res.status(422).send({
                message: "missed data"

            })

        const product = await Product.findOne({
            _id: id
        }).exec();

        if (!product) {
            return res.status(404).send({
                message: "invalid"
            })
        }


        const oldRating = product.rating;
        if (!oldRating) {
            await Product.updateOne({
                _id: id
            }, {
                $set: {
                    rating: rating
                }
            });
        } else {
            const newRating = (oldRating + rating) / 2;
            await Product.updateOne({
                _id: id
            }, {
                $set: {
                    rating: newRating
                }
            });
        }

        updatedProduct = await Product.findOne({
            _id: id
        }).exec();
        res.send(updatedProduct)
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
}


module.exports = {
    getProductReviews,
    addProductReviews,
    addProductRating,
    deleteProductReviews,
    editProductReviews
};