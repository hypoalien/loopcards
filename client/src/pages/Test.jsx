// import { useState } from 'react';

// const socialPlatforms = [
//   { name: 'Facebook', icon: 'fab fa-facebook' },
//   { name: 'Twitter', icon: 'fab fa-twitter' },
//   { name: 'Instagram', icon: 'fab fa-instagram' },
//   { name: 'LinkedIn', icon: 'fab fa-linkedin' },
//   { name: 'GitHub', icon: 'fab fa-github' },
// ];

// export default function Test() {
//   const [links, setLinks] = useState([]);

//   const addLink = () => {
//     setLinks([...links, { platform: '', url: '' }]);

//   };

//   const removeLink = (index) => {
//     setLinks(links.filter((_, i) => i !== index));
//     console.log(links)

//   };

//   const handleChange = (index, key, value) => {
//     setLinks(
//       links.map((link, i) => (i === index ? { ...link, [key]: value } : link))
//     );
//     console.log(links)

//   };

//   return (
//     <div className="space-y-2">
//       {links.map((link, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <div className="relative">
//             <select
//               value={link.platform}
//               onChange={(e) => handleChange(index, 'platform', e.target.value)}
//               className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="">Select a social platform</option>
//               {socialPlatforms.map(({ name, icon }) => (
//                 <option key={name} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </select>
//             {link.platform && (
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <i className={socialPlatforms.find(p => p.name === link.platform)?.icon} />
//               </div>
//             )}
//           </div>
//           <input
//             type="url"
//             value={link.url}
//             onChange={(e) => handleChange(index, 'url', e.target.value)}
//             className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter URL"
//           />
//           <button
//             type="button"
//             onClick={() => removeLink(index)}
//             className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
//           >Delete
//             <i className="far fa-times-circle" />
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addLink}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Add social profile
//       </button>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';

// const socialPlatforms = [
//   { name: 'Facebook', icon: 'fab fa-facebook' },
//   { name: 'Twitter', icon: 'fab fa-twitter' },
//   { name: 'Instagram', icon: 'fab fa-instagram' },
//   { name: 'LinkedIn', icon: 'fab fa-linkedin' },
//   { name: 'GitHub', icon: 'fab fa-github' },
// ];

// export default function Test({ data }) {
//   const [links, setLinks] = useState([]);

//   useEffect(() => {
//     if (data) {
//       setLinks(data);
//     } else {
//       setLinks([{ platform: '', url: '' }]);
//     }
//   }, [data]);

//   const addLink = () => {
//     setLinks([...links, { platform: '', url: '' }]);
//   };

//   const removeLink = (index) => {
//     setLinks(links.filter((_, i) => i !== index));
//   };

//   const handleChange = (index, key, value) => {
//     setLinks(
//       links.map((link, i) => (i === index ? { ...link, [key]: value } : link))
//     );
//   };

//   return (
//     <div className="space-y-2">
//       {links.map((link, index) => (
//         <div key={index} className="flex items-center space-x-2">
//           <div className="relative">
//             <select
//               value={link.platform}
//               onChange={(e) => handleChange(index, 'platform', e.target.value)}
//               className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//             >
//               <option value="">Select a social platform</option>
//               {socialPlatforms.map(({ name, icon }) => (
//                 <option key={name} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </select>
//             {link.platform && (
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <i className={socialPlatforms.find(p => p.name === link.platform)?.icon} />
//               </div>
//             )}
//           </div>
//           <input
//             type="url"
//             value={link.url}
//             onChange={(e) => handleChange(index, 'url', e.target.value)}
//             className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
//             placeholder="Enter URL"
//           />
//           <button
//             type="button"
//             onClick={() => removeLink(index)}
//             className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800"
//           >
//             <i className="far fa-times-circle" />
//           </button>
//         </div>
//       ))}
//       <button
//         type="button"
//         onClick={addLink}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Add social profile
//       </button>
//     </div>
//   );
// }

import { useState } from "react";

const SocialLinks = ({ data }) => {
  const [links, setLinks] = useState(data);

  const platforms = ["Facebook", "Twitter", "Instagram", "LinkedIn"];

  const handleAdd = () => {
    const newLink = {
      platform: platforms[0],
      url: ""
    };
    setLinks([...links, newLink]);
  };

  const handleDelete = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const handlePlatformChange = (index, event) => {
    const updatedLinks = [...links];
    updatedLinks[index].platform = event.target.value;
    setLinks(updatedLinks);
  };

  const handleUrlChange = (index, event) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = event.target.value;
    setLinks(updatedLinks);
  };

  return (
    <div>
      {links.map((link, index) => (
        <div key={index} className="my-2">
          <div className="flex items-center">
            <select
              value={link.platform}
              onChange={(event) => handlePlatformChange(index, event)}
              className="mr-2 rounded-md border-gray-300"
            >
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={link.url}
              onChange={(event) => handleUrlChange(index, event)}
              className="mr-2 rounded-md border-gray-300 px-2 py-1 w-full"
            />
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAdd}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-2 py-1"
      >
        Add social profile
      </button>
    </div>
  );
};

export default SocialLinks;
