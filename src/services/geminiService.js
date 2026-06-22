/**
 * Gemini API Service for fetching weekly trending media data
 */

export const fetchWeeklyMediaFromGemini = async (apiKey) => {
  if (!apiKey) {
    throw new Error("Vui lòng cung cấp Gemini API Key hợp lệ.");
  }

  const prompt = `Bạn là một trợ lý AI cập nhật thông tin giải trí chuyên nghiệp. Hãy đề xuất danh sách gồm chính xác 8 tác phẩm giải trí hot nhất tuần này tại Việt Nam thuộc các thể loại: "Phim Ảnh", "Trò Chơi", "Âm Nhạc".
Yêu cầu định dạng đầu ra phải là một MẢNG JSON nguyên bản (valid JSON array) chứa các đối tượng có cấu trúc chính xác như sau:
[
  {
    "id": "chu-khong-dau-viet-tat-viet-lien",
    "title": "TÊN TÁC PHẨM (Viết Hoa)",
    "category": "Phim Ảnh" | "Trò Chơi" | "Âm Nhạc", // BẮT BUỘC chỉ được dùng 1 trong 3 nhóm này
    "genre": "Thể loại chính xác",
    "rating": 9.2, 
    "year": 2026, // BẮT BUỘC chỉ đề xuất các tác phẩm phát hành hoặc có độ hot cực lớn trong năm 2025 - 2026. Tuyệt đối KHÔNG đề xuất các tác phẩm cũ từ các năm trước như "À Lôi", "Nơi Này Có Anh", "Chúng Ta Của Hiện Tại" trừ khi có phiên bản mới đặc biệt hoặc hoạt động biểu diễn cực hot năm 2026.
    "duration": "Thời lượng phát (ví dụ: '2h 15m' hoặc '4m 20s' hoặc '12 Giờ Chơi')",
    "tagline": "Một câu nói hoặc thông điệp ngắn gọn của tác phẩm.",
    "description": "Mô tả chi tiết, cuốn hút về tác phẩm.",
    "videoUrl": "Link YouTube chính thức của trailer hoặc MV",
    "posterUrl": "Link hình ảnh poster chất lượng cao từ Unsplash",
    "backdropUrl": "Link hình ảnh nền nằm ngang chất lượng cao từ Unsplash",
    "featured": true, // BẮT BUỘC gán giá trị true cho ít nhất 3 hoặc 4 tác phẩm trong danh sách để đưa vào Carousel Đề Cử
    "trending": true,
    "author": "Nghệ sĩ, ca sĩ, đạo diễn hoặc studio phát triển"
  }
]

Chú ý quan trọng để tránh lỗi giao diện và trùng lặp:
1. Giá trị của trường "category" chỉ được phép là một trong 3 chuỗi: "Phim Ảnh", "Trò Chơi", "Âm Nhạc". Tuyệt đối không dùng tên khác.
2. Để tránh trùng lặp hình ảnh, tuyệt đối KHÔNG sử dụng cùng một link ảnh mẫu cho nhiều tác phẩm khác nhau. Thay vào đó, hãy sử dụng các hình ảnh Unsplash có ID khác nhau, hoặc tự tạo link ảnh động theo từ khóa tiếng Anh liên quan đến nội dung tác phẩm. Ví dụ:
   - posterUrl: "https://images.unsplash.com/featured/500x750/?<từ-khóa-tiếng-anh-ngắn>"
   - backdropUrl: "https://images.unsplash.com/featured/1200x675/?<từ-khóa-tiếng-anh-ngắn>"
   Hãy đảm bảo từ khóa tìm kiếm cho mỗi tác phẩm là hoàn toàn KHÁC NHAU và miêu tả đúng nội dung tác phẩm (ví dụ: "cyberpunk,gameplay" cho trò chơi viễn tưởng, "sad,romance,singer" cho bài hát tâm trạng, v.v.).
3. Đối với "videoUrl", nếu không có link thật sự hoạt động ổn định, bạn có thể sử dụng các link nhạc/phim/game chính thống từ YouTube, tránh sử dụng các link hỏng hoặc không tồn tại.
4. Chỉ trả về chuỗi JSON thô (raw JSON string). Không bọc trong khối code markdown (\`\`\`json ... \`\`\`), không có lời mở đầu hay lời chào giải thích gì thêm.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 6000); // 6 seconds timeout

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      throw new Error("Không nhận được dữ liệu phản hồi từ Gemini.");
    }

    // Parse data to verify it is valid JSON
    const parsedData = JSON.parse(jsonText.trim());
    
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("Đầu ra không phải là mảng dữ liệu hợp lệ.");
    }

    return parsedData;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Thời gian yêu cầu quá hạn (Timeout 6s). Đang chuyển hướng lấy dữ liệu cũ dự phòng...");
    }
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const askGeminiChat = async (message, history, apiKey) => {
  if (!apiKey) {
    throw new Error("Vui lòng cung cấp Gemini API Key trong phần cấu hình AI.");
  }

  const systemInstruction = `Bạn là trợ lý AI chuyên gia giải trí Việt Nam của 2HT ENTERTAINMENT. Nhiệm vụ của bạn là giải đáp và tư vấn chi tiết, hấp dẫn về mọi câu hỏi liên quan đến: âm nhạc Việt Nam (bài hát hot, ca sĩ, ban nhạc, nhạc sĩ, liveshow), phim ảnh Việt Nam (phim truyền hình, phim điện ảnh chiếu rạp, phim bom tấn Việt đang được săn đón, đạo diễn, diễn viên). 
Hãy nói bằng tiếng Việt, có thái độ thân thiện, nhiệt tình và sử dụng các câu trả lời sinh động. Nếu người dùng hỏi những câu hỏi ngoài chủ đề giải trí Việt Nam, hãy lịch sự từ chối và hướng họ quay lại chủ đề phim ảnh và âm nhạc Việt.`;

  const contents = [
    ...history.map(item => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }]
    })),
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      throw new Error("Không nhận được câu trả lời từ trợ lý AI.");
    }

    return reply;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};
