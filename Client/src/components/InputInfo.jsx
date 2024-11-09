import React from "react";

export const InputInfo = ({ label, placeholder,setJobDescription }) => {
  const handleChange = (event) => {
    setJobDescription(event.target.value);
  };
  return (
    <div className="text-[17px] pb-7">
      <p className="text-[#829AB1] pb-2">{label}</p>
      <textarea
        placeholder={placeholder}
        id={label}
        rows={7}
        onChange={handleChange}
        className="hover:outline-none rounded-lg focus:outline-none px-4 py-2 focus:border-[#0D529B] border-[#112B46] border-2 bg-[#0F2033] text-[#829AB1] w-full transition-all duration-500"
      />
    </div>
  );
};
