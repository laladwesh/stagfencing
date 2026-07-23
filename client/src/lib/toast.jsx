import toast from "react-hot-toast";

export function notifyAddedToCart({ name, image }) {
  toast.custom(
    (t) => (
      <div
        className={
          "flex items-center gap-3 w-full max-w-sm bg-white border border-gray-200 shadow-lg rounded-2xl px-4 py-3 transition-all " +
          (t.visible ? "opacity-100" : "opacity-0")
        }
      >
        <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          {image && <img src={image} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black">Added to cart</p>
          <p className="text-xs text-gray-500 truncate">{name}</p>
        </div>
        <a href="/cart" className="text-xs font-medium text-black underline shrink-0">
          View cart
        </a>
      </div>
    ),
    { duration: 3000 }
  );
}

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyError(message) {
  toast.error(message);
}
