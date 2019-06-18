require "spec_helper"

describe User do
  describe "#new" do
    it "Creates a new user" do
      expect(User.new).to be_kind_of(User)
    end
  end

  around(:each) do |example|
    original = User::SKIP_EMAIL_VALIDATION
    example.run
    const_reassign(User, :SKIP_EMAIL_VALIDATION, original)
  end

  describe ".refresh_everyones_ui" do
    it "Sends a message over AMQP" do
      expect(Rollbar).to receive(:error).with("Global UI refresh triggered")
      get_msg = receive(:raw_amqp_send)
        .with({}.to_json, Api::RmqUtilsController::PUBLIC_BROADCAST)
      expect(Transport.current).to get_msg
      User.refresh_everyones_ui
    end
  end

  describe "SKIP_EMAIL_VALIDATION" do
    let (:user) { FactoryBot.create(:user, confirmed_at: nil) }

    it "considers al users verified when set to `true`" do
      const_reassign(User, :SKIP_EMAIL_VALIDATION, true)
      expect(user.verified?).to be(true)
    end

    it "does not skip when false" do
      const_reassign(User, :SKIP_EMAIL_VALIDATION, false)
      expect(user.verified?).to be(false)
    end
  end
end
