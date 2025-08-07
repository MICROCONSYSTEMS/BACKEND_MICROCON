import AddressBookRouter from './AddressBook.Routes.js';
import BrandRouter from './Brand.Routes.js';
import CategoryRouter from './Category.Routes.js';
import SubCategoryRouter from './SubCategory.Routes.js';
import UserRouter from './User.Routes.js';
import CartRouter from './Cart.Routes.js'
import FeedbackRouter from './FeedBack.Routes.js';
import WishlistRouter from './Wishlist.Routes.js';
import CouponRouter from './Coupon.Routes.js';
import PurchaseOrderRouter from './PurchaseOrder.Routes.js';
import ProductRouter from './Product.Routes.js';
import PaymentRouter from './Payment.Routes.js';
import ServiceRouter from './Service.Routes.js';
import OrderRouter from './Order.Routes.js';
import TeamMember from './TeamMember.Routes.js'
import GlobalConfigRouter from './GlobalConfig.Routes.js';
import NotifyRouter from './NotifyUser.Route.js';
import ContactFormRouter from './ContactQuery.Routes.js';

function routes(app) {
    app.use('/api/v1/addressbook', AddressBookRouter);
    app.use('/api/v1/brand', BrandRouter);
    app.use('/api/v1/user', UserRouter);
    app.use('/api/v1/category', CategoryRouter);
    app.use('/api/v1/subcategory', SubCategoryRouter);
    app.use('/api/v1/cart', CartRouter);
    app.use('/api/v1/feedback', FeedbackRouter);
    app.use('/api/v1/wishlist', WishlistRouter);
    app.use('/api/v1/discount', CouponRouter);
    app.use('/api/v1/purchase-order', PurchaseOrderRouter);
    app.use('/api/v1/product', ProductRouter);
    app.use('/api/v1/payment', PaymentRouter);
    app.use('/api/v1/service', ServiceRouter);
    app.use('/api/v1/order', OrderRouter);
    app.use('/api/v1/team-member',TeamMember);
    app.use('/api/v1/global-config',GlobalConfigRouter);
    app.use('/api/v1/notify-user',NotifyRouter);
    app.use('/api/v1/contact-form',ContactFormRouter);
}

export default routes;