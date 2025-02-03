import { ChartAnalysis } from "@src/mongo/models/analysis";

export async function updateAnalysesWithDefaultName() {
    try {
      const analyses = await ChartAnalysis.find({ name: { $exists: false } });
  
      // Update each document with the default name 'Analysis_${timestamp}'
      const updatePromises = analyses.map(async (analysis: any) => {
        const name = `Analysis_${analysis?.timestamp}`;
        await ChartAnalysis.updateOne(
          { _id: analysis._id },  // Find the document by its _id
          { $set: { name } }  // Set the new name field
        );
      });
  
      // Wait for all updates to complete
      const result = await Promise.all(updatePromises);

      console.log(result)
  
      console.log(`Updated ${updatePromises.length} analyses with default names.`);
  
    } catch (error) {
      console.error('Error updating analyses:', error);
    }
  }

