import { Service } from "../../models/index.js";
import { GetObjectURL } from "../../utils/GetObject.js";

export const GetAllServices = async (req, res) => {
  try {
    const services = await Service.find();

    const servicesWithSignedUrls = await Promise.all(
      services.map(async (service) => {
        const key = `services/${service.image.fileName}`;
        const signedUrl = await GetObjectURL(key);

        return {
          ...service.toObject(),
          image: {
            ...service.image,
            url: signedUrl,
          },
        };
      })
    );

    res.status(200).json({data:servicesWithSignedUrls, message: "Services fetched successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch services" });
  }
};
