// // import { getCareTakers } from "../server/db/queries";
// import Image from "next/image";
// import Link from "next/link";

// export default async function CareTakerList() {
//   // const careTakers = await getCareTakers();

//   type CareTaker = {
//     id: number;
//     name: string;
//     image: ImageData;
//     description: string;
//   };

//   return (
//     <div className="z-10 w-full max-w-5xl mx-auto py-8 px-4">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
//         Care Takers
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {careTakers.map((careTaker: CareTaker) => (
//           <div
//             key={careTaker.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden"
//           >
//             <Link href={`/careTaker/${careTaker.id}`}>
//               <Image
//                 src={careTaker.image}
//                 style={{ objectFit: "fill" }}
//                 width={192}
//                 height={192}
//                 alt={careTaker.name}
//                 className="w-full h-48 object-cover"
//               />
//             </Link>
//             <div className="p-4">
//               <h2 className="text-xl text-gray-700 font-semibold mb-2">
//                 {careTaker.name}
//               </h2>
//               <p className="text-gray-700">{careTaker.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
