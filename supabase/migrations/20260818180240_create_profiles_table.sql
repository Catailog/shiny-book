-- profiles 테이블 생성

-- 1. profiles 테이블 생성
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  phone TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS (보안 정책) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 누구나 프로필 조회 가능
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

-- 본인 프로필만 수정 가능
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);



-- 자동 연동 트리거 함수 등록

-- 1. 신규 유저 생성 시 profiles에 자동 삽입하는 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, phone, provider)
  VALUES (
    NEW.id,
    NEW.email,
    -- 소셜 로그인이나 signUp 시 options.data로 넘긴 full_name / name / display_name 파싱
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      '사용자'
    ),
    NEW.phone,
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 트리거 연결
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 기존에 가입해 있던 유저들 데이터 동기화
INSERT INTO public.profiles (id, email, display_name, phone, provider)
SELECT 
  id, 
  email, 
  COALESCE(
    raw_user_meta_data->>'display_name',
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    '사용자'
  ),
  phone,
  raw_app_meta_data->>'provider'
FROM auth.users
ON CONFLICT (id) DO NOTHING;