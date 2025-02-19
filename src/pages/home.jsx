import { useState } from "react";
import OpenAI from "openai";

// Hide this in environment variables
const token = import.meta.env.API_KEY;

export const Home = () => {
    const [symptoms, setSymptoms] = useState("");
    const [notes, setNotes] = useState("");
    const [results, setResults] = useState([]);
    const [disabled, setDisabled] = useState(false);

    async function askGPT(prompt) {

      try {
        console.log("fetching data...")
        const client = new OpenAI({
          baseURL: "https://models.inference.ai.azure.com",
          apiKey: token,
          dangerouslyAllowBrowser: true 
        });
      
        const response = await client.chat.completions.create({
          messages: [
            { role: "developer", content: "" },
            { role:"user", content: prompt }
          ],
          model: "o3-mini"
        });

        const GPTresponse = response.choices[0].message.content

        console.log("from askGPT ", GPTresponse)
        return GPTresponse;

      } catch (error) {
        console.error("The sample encountered an error:", error);
      }
    }
  
    const handleClick = async() => {
      setResults([])
      setDisabled(true)

      let prompt = `"You are a medical AI assistant trained to provide an initial symptom-based diagnosis. Your task is to analyze the given symptoms and additional health-related notes, then generate a response in a strict JSON format. Follow these guidelines carefully:

        Input Guidelines:
        - Symptoms: The user will provide one or more symptoms they are experiencing. These may include fever, cough, headache, fatigue, etc.
        - Additional Notes: The user may provide extra relevant health-related information (e.g., duration of symptoms, recent travel history, underlying conditions, medication use).

        Response Format:
        - Output must be a JSON array with **at least one and up to five objects**, depending on the provided symptoms.
        - **If symptoms match multiple possible conditions, return multiple objects** representing different potential diagnoses.
        - Each object must have:
          - "condition": A likely diagnosis (e.g., "Common Cold").
          - "severity": A classification of severity ("Mild", "Moderate", "Severe").
          - "action": A recommended course of action (e.g., "Rest & Hydration" or "Consult a Doctor").

        Example Response (Correct Format):
        [{"condition": "Flu", "severity": "Moderate", "action": "Rest, Hydration, and Consult a Doctor if Symptoms Persist"},{"condition": "Common Cold", "severity": "Mild", "action": "Rest, Hydration. Try Acetaminophen (Tylenol) or Ibuprofen (Advil, Motrin)"}]

        Constraints & Error Handling:
        - **Always return multiple conditions if the symptoms match more than one illness.**
        - If symptoms are too vague or insufficient for a diagnosis, return:
          [{"condition": "Insufficient Data for Diagnosis", "severity": "Unknown", "action": "Provide More Symptoms for Better Accuracy"}]
        - Do not include explanations or any text outside the JSON format.

        *Now, analyze the following user input and return diagnosis strictly in the JSON format outlined above. If multiple diagnoses are possible, return them as a list of objects."`

      
      prompt = prompt + "Symptoms: " + symptoms + " Notes: " + notes

      const response = await askGPT(prompt)
      console.log("in HandleClick: ", response) 

      // response should be sth like '[{ "condition": "Insufficient Data for Diagnosis", "severity": "Unknown", "action": "Provide More Symptoms for Better Accuracy" }]'
      const responseList = JSON.parse(response)

      setResults(responseList)
      setDisabled(false)

    };
  
    return (
      <div className="bg-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          {/* Header */}
          <h1 className="text-3xl font-bold text-blue-600 text-center">Symptom Checker</h1>
          <p className="text-gray-600 text-center mt-4">
            Enter your symptoms to receive an initial diagnosis. The more symptoms you provide, the more accurate your assessment will be!
          </p>
          
          {/* Symptoms Bar */}
          <div className="mt-1">
            <input
              type="text"
              value={symptoms}
              onChange={(e) => {
                setSymptoms(e.target.value);
              }}
              placeholder="Fatigue, bloating, dizziness...."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-gray-600 text-center mt-6">Enter any additional relevant information here.</p>
          {/* Notes Bar */}
          <div className="relative mt-1">
            <input
              type="text"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="I went to the [location]. I had [type of cuisine] etc"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Diagnosis Button */}
          <button 
            onClick={handleClick}
            disabled={disabled}
            className={`w-full py-3 mt-4 rounded-lg transition 
              ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}            
          >
            {disabled ? "Diagnosing" : "Get Diagnosis"}
          </button>
  
          {/* Diagnosis Results */}
          {results.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700">Possible Conditions:</h2>
              <div className="mt-3 space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-lg font-semibold text-blue-700">{result.condition}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">Severity:</span> {result.severity}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">Recommended Action:</span> {result.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          <p className="text-xs text-gray-500 mt-3 text-center">
            * This tool provides an initial assessment. Consult a doctor for medical advice.
          </p>
        </div>
      </div>
    );
}