require("dotenv").config();
const OpenAI = require("openai");

const configuration = new OpenAI.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI.OpenAIApi(configuration);

const PromptController = {
    connectOpenAI: (req, res) => {
        console.log(req.body.prompt);
        let model = "text-davinci-003";
        // let prompt = `Tạo trang web mô tả một sản phẩm bao gồm tiêu đề, nội dung, lợi ích, kích cỡ sản phẩm và SEO. Tiêu đề nên mô tả tính năng chính của sản phẩm, nội dung rõ ràng và dễ hiểu, cung cấp đầy đủ kích thước sản phẩm. Sử dụng đoạn mã HTML hợp lệ để đảm bảo tính tương thích và định dạng liên kết thích hợp. Bên cạnh đó hãy kiểm tra những thông tin mà người dùng nhập vào nếu có:. Tên sản phẩm: Aó thun nam cổ trơn. Đối tượng khách hàng hướng đến: giới trẻ.`;
        let { prompt } = req.body;
        let maxToken = 1500;
        let temperature = 0.6;
        let topP = 0.9;
        let stream = true;
        let stop = "";
        const completion = openai.createCompletion(
            {
                model: model,
                prompt: prompt,
                max_tokens: maxToken,
                temperature: temperature,
                top_p: topP,
                stop: stop,
                stream: stream,
            },
            {
                responseType: "stream",
                headers: {
                    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
                },
            }
        );

        completion.then((resp) => {
            resp.data.on("data", (data) => {
                const lines = data
                    .toString()
                    .split("\n")
                    .filter((line) => line.trim() !== "");
                for (const line of lines) {
                    const message = line.replace(/^data: /, "");
                    if (message === "[DONE]") {
                        return;
                    }
                    const parsed = JSON.parse(message);
                    res.write(parsed.choices[0].text);
                }
            });
        });
    },
};

module.exports = PromptController;
