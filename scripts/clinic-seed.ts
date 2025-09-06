import prisma from "@/lib/prisma";
import { clinicsList } from "@/lib/clinics-list";

// Upload to db
async function seedClinics() {
  try {
    const newRecords = await prisma.clinic.createMany({
      data: clinicsList.features.map((clinic) => ({
        hci_code: clinic.properties.HCI_CODE.toString(),
        lat: parseFloat(clinic.geometry.coordinates[1].toString()),
        lng: parseFloat(clinic.geometry.coordinates[0].toString()),
        x_cor: parseFloat(clinic.properties.X_COORDINATE.toString()),
        y_cor: parseFloat(clinic.properties.Y_COORDINATE.toString()),
        name: clinic.properties.HCI_NAME,
        license_type: clinic.properties.LICENCE_TYPE.toString(),
        phone_number: clinic.properties.HCI_TEL?.toString(),
        postal_code: clinic.properties.POSTAL_CD.toString(),
        addr_type: clinic.properties.ADDR_TYPE?.toString(),
        block_no: clinic.properties.BLK_HSE_NO
          ? clinic.properties.BLK_HSE_NO.toString()
          : null,
        floor_no: clinic.properties.FLOOR_NO
          ? clinic.properties.FLOOR_NO.toString()
          : null,
        unit_no: clinic.properties.UNIT_NO
          ? clinic.properties.UNIT_NO.toString()
          : null,
        street_name: clinic.properties.STREET_NAME,
        building_name: clinic.properties.BUILDING_NAME,
        clinic_prog_code: JSON.stringify(
          clinic.properties.CLINIC_PROGRAMME_CODE,
        ),
        address: `${clinic.properties.BLK_HSE_NO ? `Blk ${clinic.properties.BLK_HSE_NO} ` : ""}${clinic.properties.STREET_NAME ? `${clinic.properties.STREET_NAME}, ` : ""}${clinic.properties.FLOOR_NO || clinic.properties.UNIT_NO || clinic.properties.BUILDING_NAME ? `${clinic.properties.FLOOR_NO ? `${clinic.properties.FLOOR_NO}, ` : ""}${clinic.properties.UNIT_NO ? `#${clinic.properties.UNIT_NO}, ` : ""}${clinic.properties.BUILDING_NAME ? `${clinic.properties.BUILDING_NAME}, ` : ""}` : ""}Singapore ${clinic.properties.POSTAL_CD}`,
      })),
    });

    console.log("New records added:", newRecords);
  } catch (error) {
    console.error("Error adding records:", error);
  }
}

seedClinics();

async function deleteClinics() {
  try {
    const deletedRecords = await prisma.clinic.deleteMany({
      where: {
        createdAt: {
          gte: new Date("2024-03-12"),
        },
      },
    });
    console.log("Deleted records:", deletedRecords);
  } catch (error) {
    console.error("Error deleting records:", error);
  }
}

//deleteClinics();

async function fixAddress() {
  try {
    const clinics = await prisma.clinic.findMany();
    for (const clinic of clinics) {
      const address = `${clinic.block_no ? `Blk ${clinic.block_no} ` : ""}${clinic.street_name ? `${clinic.street_name}, ` : ""}${clinic.floor_no || clinic.unit_no || clinic.building_name ? `${clinic.floor_no ? `${clinic.floor_no}, ` : ""}${clinic.unit_no ? `#${clinic.unit_no}, ` : ""}${clinic.building_name ? `${clinic.building_name}, ` : ""}` : ""}Singapore ${clinic.postal_code}`;
      const updatedRecord = await prisma.clinic.update({
        where: {
          id: clinic.id, // Update the property to 'id' instead of 'hci_code'
        },
        data: {
          address: address,
        },
      });
    }
    console.log("Updated record:");
  } catch (error) {
    console.error("Error updating records:", error);
  }
}

fixAddress();
