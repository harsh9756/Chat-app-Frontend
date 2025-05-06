export default function Modal({ open, setOpen, children }) {
    return (
        <div className={`absolute inset-0 z-50 w-full bg-black bg-opacity-30 h-full justify-center items-center flex ${open ? "visible" : "invisible"}`}>
            <div className="relative h-[90vh] lg:w-[40%] md:w-[70%] sm:w-[90%]  bg-white rounded-lg shadow dark:bg-gray-700">
                <button onClick={() => setOpen(false)} type="button" className="absolute right-1 top-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                {children}
            </div>
        </div>
    );
}