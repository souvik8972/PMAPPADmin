let ClientList=[
    {
      id:1,
      companyName:"Stemline",
      OutSourceValue:738.00,
      TotalPO:783.40,
      PredicatedGp:50,
      currentGP:-100,
      PoValue:100,
      companyLogo:`https://cdn.zonebourse.com/static/instruments-logo-11168022`,
      Projects:[
        {
          started:"April",
          project:[
            {
              projectID:2110,
              ProjectName:"Stemline Website",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
            {
              projectID:2113,
              ProjectName:"Stemline Emailer",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
            {
              projectID:2116,
              ProjectName:"Stemline banners",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            }
          ]
        },
        {
          started:"March",
          Project:[
            {
              projectID:2440,
              ProjectName:"Stemline Website",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
           
          ]
        }
      ]
   
   
    },
    {
      id:2,
      companyName:"Allergan US",
      OutSourceValue:738.00,
      TotalPO:1187.40,
      PredicatedGp:100,
      PoValue:783,
      currentGP:-10,
      companyLogo:`https://www.allerganbrandbox.com/wp-content/uploads/2023/03/alle_logo_black-scaled-2-jpg-370x370@2x.jpg`,
      Projects:[
        {
          started:"April",
          project:[
            {
              projectID:2110,
              ProjectName:"Stemline Website",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
   
            {
              projectID:2113,
              ProjectName:"Stemline Emailer",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
   
            {
              projectID:2116,
              ProjectName:"Stemline banners",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            }
          ]
        },
   
        {
          started:"March",
          Project:[
            {
              projectID:2440,
              ProjectName:"Stemline Website",
              TimeLine:"20-apr-2025 To 30-apr-2025",
              Emp:"Darshan",
              ProjectManger:"Shijin Pulikkotil",
            },
           
          ]
        }
      ]
   
   
    }
  ]
   
   
   
   
  export default ClientList
   
  // import { useState } from 'react';
  // import { View, Text, TextInput } from 'react-native';
  // import DropDownPicker from 'react-native-dropdown-picker';
   
  // const ProjectForm = () => {
  //   const [openClient, setOpenClient] = useState(false);
  //   const [selectedClient, setSelectedClient] = useState(null);
  //   const [clients, setClients] = useState([
  //     { label: 'Client A', value: 'client_a' },
  //     { label: 'Client B', value: 'client_b' },
  //   ]);
   
  //   const [openStatus, setOpenStatus] = useState(false);
  //   const [selectedStatus, setSelectedStatus] = useState(null);
  //   const [statuses, setStatuses] = useState([
  //     { label: 'Active', value: 'active' },
  //     { label: 'Pending', value: 'pending' },
  //   ]);
   
  //   const [openStartDate, setOpenStartDate] = useState(false);
  //   const [selectedStartDate, setSelectedStartDate] = useState(null);
  //   const [dates, setDates] = useState([
  //     { label: '01-Apr-2025', value: '2025-04-01' },
  //     { label: '15-Apr-2025', value: '2025-04-15' },
  //   ]);
   
  //   return (
  //     <View style={{ flexGrow: 1 }} className="m-2">
  //       {/* Project Name */}
  //       <Text>Project Name:</Text>
  //       <TextInput className="my-2 p-3 border-gray-300 border-2 rounded-lg" />
   
  //       {/* Region & Project Code */}
  //       <View className="flex-row w-full">
  //         <View className="flex w-1/2">
  //           <Text>Region</Text>
  //           <TextInput className="border-gray-300 border-2 rounded-lg p-3" />
  //         </View>
  //         <View className="flex w-1/2 pl-2">
  //           <Text>Project Code:</Text>
  //           <TextInput className="border-gray-300 border-2 rounded-lg p-3" />
  //         </View>
  //       </View>
   
  //       {/* Dropdowns - Client & Status */}
  //       <View className="flex-row w-full">
  //         <View className="flex w-1/2 z-50">
  //           <Text>Client:</Text>
  //           <DropDownPicker
  //             open={openClient}
  //             value={selectedClient}
  //             items={clients}
  //             setOpen={setOpenClient}
  //             setValue={setSelectedClient}
  //             setItems={setClients}
  //             placeholder="Select Client"
  //             containerStyle={{ height: 50 }}
  //             style={{ borderColor: '#ccc', borderWidth: 2, borderRadius: 8 }}
  //             dropDownContainerStyle={{ borderColor: '#ccc', borderWidth: 2 }}
  //             zIndex={3000}
  //             listMode="SCROLLVIEW" // Improves performance
  //           />
  //         </View>
   
  //         <View className="flex w-1/2 pl-2 z-40">
  //           <Text>Status</Text>
  //           <DropDownPicker
  //             open={openStatus}
  //             value={selectedStatus}
  //             items={statuses}
  //             setOpen={setOpenStatus}
  //             setValue={setSelectedStatus}
  //             setItems={setStatuses}
  //             placeholder="Select Status"
  //             containerStyle={{ height: 50 }}
  //             style={{ borderColor: '#ccc', borderWidth: 2, borderRadius: 8 }}
  //             dropDownContainerStyle={{ borderColor: '#ccc', borderWidth: 2 }}
  //             zIndex={2000}
  //             listMode="SCROLLVIEW"
  //           />
  //         </View>
  //       </View>
   
  //       {/* Dropdowns - Start Date & End Date */}
  //       <View className="flex-row w-full">
  //         <View className="flex w-1/2 z-30">
  //           <Text>Start Date:</Text>
  //           <DropDownPicker
  //             open={openStartDate}
  //             value={selectedStartDate}
  //             items={dates}
  //             setOpen={setOpenStartDate}
  //             setValue={setSelectedStartDate}
  //             setItems={setDates}
  //             placeholder="Start Date"
  //             containerStyle={{ height: 50 }}
  //             style={{ borderColor: '#ccc', borderWidth: 2, borderRadius: 8 }}
  //             dropDownContainerStyle={{ borderColor: '#ccc', borderWidth: 2 }}
  //             zIndex={1000}
  //             listMode="SCROLLVIEW"
  //           />
  //         </View>
  //         <View className="flex w-1/2 pl-2">
  //           <Text>End Date:</Text>
  //           <TextInput className="border-gray-300 border-2 rounded-lg p-3" />
  //         </View>
  //       </View>
   
  //       {/* Project Owner */}
  //       <Text>Project Owner:</Text>
  //       <TextInput className="my-2 p-3 border-gray-300 border-2 rounded-lg" />
  //     </View>
  //   );
  // };
   
  // export default ProjectForm;
   