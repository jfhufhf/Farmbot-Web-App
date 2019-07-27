require "spec_helper"

describe Api::DeviceCertsController do
  include Devise::Test::ControllerHelpers
  describe "#create" do
    let(:user) { FactoryBot.create(:user) }
    let(:device) { user.device }
    TAGS = ["FOO:BAR", "BAR:BAZ"]
    SERIAL = "456"

    def user_tags_ser(tags = TAGS)
      # So many locals: ========================================================
      ser = SERIAL
      conn = double("Create a cert", :ca_file= => nil,
                                     :cert_store => nil,
                                     :cert_store= => nil,
                                     :use_ssl => nil,
                                     :use_ssl= => nil,
                                     :cert= => nil,
                                     :key= => nil)
      post_data = { identifier: 456 }
      resp1 = double("get response", code: "200",
                                     body: { data: {} }.to_json)
      resp2 = double("put response", code: "201",
                                     body: { data: post_data }.to_json)
      resp3 = double("post response", code: "200",
                                      body: { data: {
                                        "cert" => "???",
                                      } }.to_json)
      url = NervesHub.device_path(ser)
      put_args = [NervesHub.device_path(ser),
                  { "tags": tags }.to_json,
                  NervesHub::HEADERS]
      post_data = a_string_including("\"identifier\":456")
      post_args = ["/orgs/farmbot/products/farmbot/devices/456/certificates/sign",
                   post_data,
                   { "Content-Type" => "application/json" }]

      # Setup wiring ===========================================================
      NervesHub.set_conn(conn)
      expect(NervesHub.conn).to(receive(:get)
        .with(url)
        .and_return(resp1))

      expect(NervesHub.conn).to(receive(:put)
        .with(*put_args)
        .and_return(resp2))

      expect(NervesHub.conn).to(receive(:post)
        .with(*post_args)
        .and_return(resp3))
      return [user, tags, ser]
    end

    it "creates a cert" do
      user, tags, ser = user_tags_ser
      sign_in user
      payl = { tags: tags, serial_number: ser }
      run_jobs_now do
        post :create, body: payl.to_json, params: { format: :json }
      end
      expect(response.status).to eq(200)
      expect(json).to be_kind_of(Hash)
      expect(json.fetch(:id)).to eq(device.id)
    end

    it "catches malformed tags" do
      user, tags, ser = user_tags_ser(["one_bad_one"])
      sign_in user
      payl = { tags: tags, serial_number: ser }
      report = { error: NervesHub::BAD_TAG, serial_number: SERIAL, tags: tags }
      expect(NervesHub).to(receive(:report_problem).with(**report))
      run_jobs_now do
        post :create, body: payl.to_json, params: { format: :json }
      end
      expect(response.status).to eq(200)
      expect(json).to be_kind_of(Hash)
      expect(json.fetch(:id)).to eq(device.id)
    end
  end
end
