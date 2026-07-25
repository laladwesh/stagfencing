require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Service = require("./models/Service");

async function run() {
  await connectDB();

  const service = await Service.findOne({ slug: "asbestos-fence-removal" });
  if (!service) {
    console.log("Service not found: asbestos-fence-removal");
    await mongoose.connection.close();
    return;
  }

  service.identificationTitle = "Is my fence asbestos?";
  service.identificationSubtitle = "Three quick tells — then text us a photo and we'll confirm for free";
  service.identificationCards = [
    {
      image: "",
      title: 'Corrugated "super six" profile',
      description: "Deep, wavy sheets in flat panels — the classic asbestos fence look.",
    },
    {
      image: "",
      title: "Grey, brittle & pre-1990",
      description: "Dull cement-grey that chips at the base, on a home built before 1990.",
    },
    {
      image: "",
      title: "Moulded capping on top",
      description: "A rounded capping strip riding the sheet tops is a near-certain giveaway.",
    },
  ];

  await service.save();
  console.log("Updated identification cards for asbestos-fence-removal");
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.connection.close();
});
