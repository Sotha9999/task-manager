import React from "react";

function Responsive() {
  return (
    /* Mobile first: Red background 
       Medium screens (768px+): Green background 
       Large screens (1024px+): Blue background 
    */
    <div className="bg-red-500 text-center p-4 md:bg-green-500 lg:bg-blue-500 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white mb-4">Responsive Design</h1>
      
      <p className="mb-6 text-white/90">This is a paragraph that adapts with the container.</p>

      {/* Changed w-96 to max-w-sm and added w-full for better mobile scaling */}
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
            className="w-full"
          />
        </figure>
        <div className="card-body text-left">
          <h2 className="card-title">Card Title</h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Responsive;