require 'json'


class WechatLoginController < ApplicationController
    def index
      @code = params[:code]
        if @code != nil
            uri = URI('https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx1fc7aa6e982bff72&secret=98fcdcee7c5d414caa14e2ba8df0ebaf&code='+@code+'&grant_type=authorization_code')
            res = Net::HTTP.get_response(uri)
            respond_json = JSON.parse(res.body)
            if respond_json["openid"] != nil #若获取到openid的话
                #判断当前用户是否存在
                params = { 
                            email:                 respond_json["openid"]+"@qq.com",
                            password:              "12345678",
                            password_confirmation: "12345678",
                            name:                  respond_json["openid"] 
                        }
                
                #仅需判断用户的email是否存在即可
                @user    = User.find_by(email:respond_json["openid"]+"@qq.com") # 判断当前用户是否存在
                if @user != nil # 说明用户一斤存在
                    input = {
                    email: respond_json["openid"]+"@qq.com",
                    password: "12345678",
                    fbos_version: Gem::Version.new("10.9.8"),
                    }
                    x = Auth::CreateToken.run(input)
                else
                    mutate Users::Create.run(params)  # 用户注册 还未解决判断用户是否存在后自动登录的问题
                end
            end    
            # else
            #     render json: {error: NO_USER_ATTR}, status: 422
            # end
        end
    end        
end
