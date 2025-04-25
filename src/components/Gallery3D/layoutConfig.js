export const getLayoutConfig = (theme) => {
    switch (theme) {
        case "modern":
            // fallback: 기존 modern 테마
            return {
                galleryModelPath: "/models/vr_art_gallery_01.glb",
                environment: "night",
                playerStart: [-17, 2, 0], // Player 시작 위치
                getPosition: (index) => {
                    const isRightWall = index % 2 === 0;
                    const gap = 7;
                    const baseX = Math.floor(index / 2) * gap;
                    return {
                        position: [baseX - 10, 2, isRightWall ? 12 : -12],
                        rotation: [0, isRightWall ? Math.PI : 0, 0],
                    };
                },
                getFocusTransform: () => ({
                    position: [7.5, 3, 0],            // 전시관 공통 확대 위치
                    rotation: [0, -Math.PI/2, 0],     // 전시관 공통 회전
                }),
                focusScale: 16,  // 확대 크기 고정
            };
            case "circle":
                return {
                  galleryModelPath: "/models/art_gallery.glb",
                  playerStart: [0, 0.8, -12], // 원 바깥에서 중앙을 바라보도록 설정
                  environment: "sunset",
              
                  getPosition: (index, total = 12) => {
                    const radius = 15; // 원 반지름, 원 넓이 결정
                    const angle = (index / total) * 2 * Math.PI; // 각도 라디안값
                    const x = Math.sin(angle) * radius;
                    const z = Math.cos(angle) * radius;
                    const y = 2;
              
                    return {
                      position: [x, y, z],
                      rotation: [0, angle, 0], // 중심을 향하게 회전
                    };
                  },
              
                  getFocusTransform: () => ({
                    position: [0, 3, 0], // 원의 중심에서 확대 (중앙 기준)
                    rotation: [0, 0, 0],
                  }),
              
                  focusScale: 8,
                };
    }
};
