# Blood Metrics Dashboard

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/maudoodfareed/Health-Test.git
   cd blood-metrics-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Install Material-UI and Axios**:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled axios
   ```

4. **Set Up OpenAI API Key**:
   - Create a `.env` in the main directory and place your Openai API key there.  
   - Like this: 
   ```bash
        REACT_APP_OPENAI_API_KEY = SK-sad12d-123dsa-wq1edqfwqrq (PUT YOUR API KEY Instead)
   ```

5. **Run the Application**:
   ```bash
   npm start
   ```

## Assumptions

- High-risk thresholds are pre-defined as:
  - A1C >= 6.5%
  - LDL >= 160 mg/dL
  - Glucose >= 126 mg/dL

## Implementation Choices

- **React** and **Material-UI** were chosen to create a user-friendly interface.
- **OpenAI GPT-4o** API integration for dynamic risk analysis summarization.
- A **loading state** is used to indicate data processing to the user.
