"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const cart = yield cart_model_1.default.findOne({ user: userId }).populate("items.product");
    res.json(cart || { user: userId, items: [] });
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { productId, quantity } = req.body;
    let cart = yield cart_model_1.default.findOne({ user: userId });
    const product = yield product_model_1.default.findById(productId);
    if (!product)
        return res.status(404).json({ message: "Product not found" });
    if (!cart) {
        cart = yield cart_model_1.default.create({
            user: userId,
            items: [{ product: productId, quantity }],
        });
    }
    else {
        const index = cart.items.findIndex((item) => item.product.toString() === productId);
        if (index > -1) {
            cart.items[index].quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        yield cart.save();
    }
    res.status(200).json(cart);
});
exports.addToCart = addToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { productId, quantity } = req.body;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart)
        return res.status(404).json({ message: "Cart not found" });
    const index = cart.items.findIndex((item) => item.product.toString() === productId);
    if (index > -1) {
        cart.items[index].quantity = quantity;
        yield cart.save();
        return res.json(cart);
    }
    res.status(404).json({ message: "Product not in cart" });
});
exports.updateCartItem = updateCartItem;
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { productId } = req.params;
    const cart = yield cart_model_1.default.findOne({ user: userId });
    if (!cart)
        return res.status(404).json({ message: "Cart not found" });
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    yield cart.save();
    res.json(cart);
});
exports.removeCartItem = removeCartItem;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    yield cart_model_1.default.findOneAndDelete({ user: userId });
    res.json({ message: "Cart cleared" });
});
exports.clearCart = clearCart;
