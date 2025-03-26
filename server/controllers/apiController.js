const axios = require('axios');
const config = require('../config/config');
const messages = require('../utils/messages');

// @desc    Generate Trivia questions
// @route   POST /api/v1/trivia/generate
// @access  Private
exports.generateTrivia = async (req, res) => {
    try {
        const { topic, count = config.DEFAULT_QUESTION_COUNT} = req.body;

        // Validate topic parameter
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: messages.MISSING_TOPIC,
            });
        }

        const systemPrompt = messages.TRIVIA_SYSTEM_PROMPT.replace('{count}', count).replace('{topic}', topic);
        const userPrompt = messages.TRIVIA_USER_PROMPT.replace('{count}', count).replace('{topic}', topic);

        // Call OpenAI api
        const openaiResponse = await axios.post(config.OPENAI_API_URL, {
            model: config.OPENAI_MODEL,
            messages: [
                {
                    role: "system", 
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });

        // Parse OpenAI response
        let questions = [];
        const content = openaiResponse.data.choices[0].message.content;
        
        try {
            // First try direct JSON parsing
            questions = JSON.parse(content);
        } catch (parseError) {            
            try {
                // Look for JSON-like content between brackets
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    questions = JSON.parse(jsonMatch[0]);
                } else {
                    // Find any object-like structures
                    const objMatch = content.match(/\{[\s\S]*\}/);
                    if (objMatch) {
                        const possibleObj = JSON.parse(objMatch[0]);
                        // Check if it's an array-like object with numeric keys
                        if (possibleObj && typeof possibleObj === 'object') {
                            if (Array.isArray(possibleObj)) {
                                questions = possibleObj;
                            } else {
                                // Convert object to array if it has numeric keys
                                const values = Object.values(possibleObj);
                                if (values.length > 0) {
                                    questions = values;
                                }
                            }
                        }
                    }
                }
            } catch (extractError) {
                // Structure content as questions
                // Split by numbered items or question marks
                const lines = content.split(/\d+\.|Question \d+:|(?<=\?)\s/g)
                    .filter(line => line.trim().length > 0);
                
                if (lines.length > 0) {
                    // Create basic question objects from the text
                    questions = lines.map((line, index) => {
                        // Extract question and possible options
                        const questionMatch = line.match(/(.+\?)/);
                        const question = questionMatch ? questionMatch[1].trim() : `Question ${index + 1}`;
                        
                        // Look for options in the format A), a., A., etc.
                        const optionsMatches = line.match(/[A-D][).:][\s\S]+?(?=[A-D][).:]|$)/g);
                        let options = [];
                        let correctAnswer = "";
                        
                        if (optionsMatches && optionsMatches.length > 0) {
                            options = optionsMatches.map(opt => opt.replace(/^[A-D][).:]/, '').trim());
                            // Default to first option as correct if we can't determine
                            correctAnswer = options[0];
                        }
                        
                        return {
                            question,
                            options: options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"],
                            correctAnswer: correctAnswer
                        };
                    });
                }
            }
        }

        // Return questions
        res.status(200).json({
            success: true,
            data: questions,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: messages.SERVER_ERROR,
        });
    }
}

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.